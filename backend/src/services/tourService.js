import { db } from "../db/firebase.js";
import { uploadImageFromUri } from "./uploadService.js";
//  add tour service
const MIN_ID_THRESHOLD = 600000;
// Tạo id đặc biệt
async function generateUniqueTourId() {
  return await db.runTransaction(async (transaction) => {
    const counterRef = db.collection("counters").doc("counter_tours");
    const counterDoc = await transaction.get(counterRef);

    let nextId;
    if (!counterDoc.exists) {
      nextId = MIN_ID_THRESHOLD;
      transaction.set(counterRef, { current: nextId });
    } else {
      nextId = counterDoc.data().current + 1;
      if (nextId < MIN_ID_THRESHOLD) nextId = MIN_ID_THRESHOLD;
      transaction.update(counterRef, { current: nextId });
    }
    return nextId;
  });
}
// add tour
export const addTourService = async ({ body, files }) => {
  // --- 1. Lấy data JSON ---
  let data;
  try {
    data = body.data ? JSON.parse(body.data) : body; // web gửi JSON trong 'data', mobile gửi thẳng
  } catch (err) {
    throw new Error("Invalid JSON data");
  }

  const currentId = await generateUniqueTourId();
  const documentId = String(currentId);

  // --- 2. Lọc file theo fieldname ---
  const imageTourFile = files.find(f => f.fieldname === "image_tour");
  const detailFiles = files.filter(f => f.fieldname === "itinerary_image");
// --- 3. Upload main image ---
    if (imageTourFile) {
    // dùng buffer thay vì object Multer
    data.image_tour = await uploadImageFromUri(imageTourFile.buffer, `tour-${currentId}`);
    } else if (data.image_tour && typeof data.image_tour === "string") {
    // Mobile uri, giữ nguyên
    }

    // --- 4. Upload detail images ---
    const details = data.details || [];
    for (let i = 0; i < details.length; i++) {
    if (detailFiles[i]) {
        // dùng buffer
        details[i].itinerary_image = await uploadImageFromUri(detailFiles[i].buffer, `tour-${currentId}-day-${i+1}`);
    } else if (details[i].itinerary_image && typeof details[i].itinerary_image === "string") {
        // Mobile uri, giữ nguyên
    }
    }


  // --- 5. Lưu tour chính ---
  const tourData = {
    id_tour: currentId,
    name_tour: data.name_tour,
    price_tour: Number(data.price_tour),
    duration_tour: data.duration_tour,
    location_tour: data.location_tour,
    image_tour: data.image_tour || null,
    reviews_tour: data.reviews_tour || 0,
    created_at: new Date().toISOString(),
  };
  await db.collection("tours").doc(documentId).set(tourData);

  // --- 6. Lưu details ---
  if (details.length > 0) {
    const batch = db.batch();
    const detailsRef = db.collection("tours").doc(documentId).collection("tours_details");

    details.forEach((d, i) => {
      const docRef = detailsRef.doc();
      batch.set(docRef, {
        itinerary_day: `Day ${i + 1}`,
        itinerary_desc: d.itinerary_desc || "",
        itinerary_accommodation: d.itinerary_accommodation || null,
        itinerary_image: d.itinerary_image || null,
        operator_name: d.operator_name || "Explore!",
        tour_style_title: d.tour_style_title || "Travel Style",
        tour_style_desc: d.tour_style_desc || "Discovery",
        guide_type_title: d.guide_type_title || "Travel Guide",
        guide_type_desc: d.guide_type_desc || "Local Guides",
        intensity_title: d.intensity_title || "Fitness Level",
        intensity_desc: d.intensity_desc || "Challenging",
        language: d.language || "English, French",
        group_size: d.group_size || "1-16 people",
        age_range: d.age_range || "Min 12+",
      });
    });

    await batch.commit();
  }

  return { id: documentId, id_tour: currentId };
};
// xóa tour
/** Xóa toàn bộ subcollection tours_details */
async function deleteSubcollection(path) {
  const subRef = db.collection(path);
  const snap = await subRef.get();

  const batchArray = [];
  let batch = db.batch();
  let count = 0;

  snap.forEach((doc) => {
    batch.delete(doc.ref);
    count++;
    if (count >= 400) {
      batchArray.push(batch.commit());
      batch = db.batch();
      count = 0;
    }
  });

  batchArray.push(batch.commit());
  await Promise.all(batchArray);
}

/** Xóa tour chính + details */
export const deleteTourService = async (docId) => {
  if (!docId) throw new Error("Missing tour id");

  const tourRef = db.collection("tours").doc(docId);

  // Kiểm tra tồn tại
  const docSnap = await tourRef.get();
  if (!docSnap.exists) {
    throw new Error("Tour not found");
  }

  // 1. Xóa sub-collection
  await deleteSubcollection(`tours/${docId}/tours_details`);

  // 2. Xóa document chính
  await tourRef.delete();

  return { id: docId };
};

export const updateTourService = async (...args) => {
  // A. XỬ LÝ THAM SỐ LINH HOẠT (Chấp nhận cả gọi kiểu Object hoặc Rời rạc)
  let docId, body, filesRaw;

  if (args.length === 1 && typeof args[0] === 'object' && args[0].docId) {
    // Trường hợp Controller gọi: service({ docId, body, files })
    ({ docId, body, files: filesRaw } = args[0]);
  } else {
    // Trường hợp Controller gọi: service(id, body, files)
    [docId, body, filesRaw] = args;
  }

  // Validate ID lần cuối để tránh lỗi "Invalid resource path"
  if (!docId || typeof docId !== 'string' || !docId.trim()) {
    throw new Error(`Invalid Tour ID received: ${JSON.stringify(docId)}`);
  }

  console.log(`>>> PROCESSING UPDATE FOR TOUR: ${docId}`);

  const tourRef = db.collection("tours").doc(docId);
  const tourSnap = await tourRef.get();
  if (!tourSnap.exists) throw new Error("Tour not found");

  // B. PARSE DỮ LIỆU JSON
  let data;
  try {
    // Nếu gửi qua FormData, dữ liệu text thường nằm trong field 'data' dạng string
    data = body.data ? JSON.parse(body.data) : body;
  } catch (e) {
    throw new Error("Invalid JSON format in body.data");
  }

  // C. XỬ LÝ FILE (Chuyển mọi format file về mảng phẳng)
  let filesArray = [];
  if (Array.isArray(filesRaw)) {
    filesArray = filesRaw; // Đã là mảng (upload.any)
  } else if (filesRaw && typeof filesRaw === 'object') {
    // Là object (upload.fields) -> gom hết value lại thành mảng
    Object.values(filesRaw).forEach((arr) => {
      if (Array.isArray(arr)) filesArray.push(...arr);
    });
  }
  
  // D. UPDATE MAIN INFO (Thông tin chính)
  const mainImageFile = filesArray.find((f) => f.fieldname === "image_tour");
  if (mainImageFile) {
    console.log("-> Uploading new main thumbnail...");
    data.image_tour = await uploadImageFromUri(
      mainImageFile.buffer,
      `tour-${docId}-thumbnail-${Date.now()}`
    );
  }

  const mainUpdate = {
    name_tour: data.name_tour,
    price_tour: Number(data.price_tour),
    duration_tour: data.duration_tour,
    location_tour: data.location_tour,
    image_tour: data.image_tour || tourSnap.data().image_tour,
    // Giữ nguyên các field khác nếu không gửi lên
    updated_at: new Date().toISOString(),
  };

  // Cập nhật thông tin chính
  await tourRef.update(mainUpdate);

  // E. UPDATE DETAILS (Chi tiết từng ngày)
  const details = data.details || [];
  const detailRef = tourRef.collection("tours_details");

  // Lấy danh sách ID hiện tại trong DB để so sánh (để biết cái nào cần xóa)
  const existingSnap = await detailRef.get();
  const existingIds = existingSnap.docs.map((d) => d.id);

  console.log(`-> Found ${existingIds.length} existing details. Incoming: ${details.length}`);

  for (let i = 0; i < details.length; i++) {
    const d = details[i];
    
    // 1. Map ảnh: Tìm file có fieldname là 'itinerary_image_0', 'itinerary_image_1'...
    const expectedFieldName = `itinerary_image_${i}`;
    const specificFile = filesArray.find(f => f.fieldname === expectedFieldName);
    
    let itinerary_image = d.itinerary_image; // Mặc định giữ URL cũ (nếu frontend gửi string)

    if (specificFile) {
      console.log(`   + Uploading new image for Day ${i + 1} (${expectedFieldName})`);
      itinerary_image = await uploadImageFromUri(
        specificFile.buffer,
        `tour-${docId}-day-${i + 1}-${Date.now()}`
      );
    }

    // 2. Chuẩn bị data cho ngày đó
    const detailData = {
      itinerary_day: d.itinerary_day || `Day ${i + 1}`,
      itinerary_desc: d.itinerary_desc || "",
      itinerary_accommodation: d.itinerary_accommodation || "",
      itinerary_image: itinerary_image || null,
      
      // Global settings
      operator_name: d.operator_name || "",
      tour_style_desc: d.tour_style_desc || "",
      guide_type_desc: d.guide_type_desc || "",
      intensity_desc: d.intensity_desc || "",
      language: d.language || "",
      group_size: d.group_size || "",
      age_range: d.age_range || "",
    };

    // 3. Quyết định: UPDATE hay ADD
    // Điều kiện update: Có ID, ID là string, và ID này ĐANG TỒN TẠI trong DB
    const isUpdate = d.id && typeof d.id === 'string' && existingIds.includes(d.id);

    if (isUpdate) {
      await detailRef.doc(d.id).update(detailData);
      // Xóa khỏi danh sách "chờ xóa"
      const indexToRemove = existingIds.indexOf(d.id);
      if (indexToRemove !== -1) existingIds.splice(indexToRemove, 1);
    } else {
      await detailRef.add(detailData);
    }
  }

  // F. XÓA CÁC NGÀY THỪA
  // Những ID nào còn sót lại trong existingIds nghĩa là frontend không gửi lên -> Xóa
  if (existingIds.length > 0) {
    console.log(`-> Deleting ${existingIds.length} removed days...`);
    for (const deleteId of existingIds) {
      await detailRef.doc(deleteId).delete();
    }
  }

  console.log(">>> UPDATE COMPLETED SUCCESSFULLY");
  return { success: true };
};

// --- 2. SERVICE GET TOUR (BẮT BUỘC PHẢI DÙNG CÁI NÀY ĐỂ UPDATE HOẠT ĐỘNG) ---
// Nếu không dùng hàm này lấy ID, hàm update ở trên sẽ luôn tạo mới ngày (Add) thay vì sửa (Update)
export const getTourByIdService = async (tourId) => {
  // 1. Lấy thông tin chính
  const tourRef = db.collection("tours").doc(tourId);
  const tourSnap = await tourRef.get();

  if (!tourSnap.exists) throw new Error("Tour not found");
  const tourData = tourSnap.data();

  // 2. --- QUAN TRỌNG: LẤY CHI TIẾT NGÀY (SUB-COLLECTION) ---
  const detailsSnap = await tourRef.collection("tours_details")
    .orderBy("itinerary_day", "asc") // Sắp xếp Day 1, Day 2...
    .get();

  // Map ra mảng và PHẢI LẤY ID
  const detailsList = detailsSnap.docs.map(doc => ({
    id: doc.id, // <--- CÓ CÁI NÀY MỚI UPDATE ĐƯỢC
    ...doc.data()
  }));

  // 3. Trả về trọn bộ
  return {
    id: tourSnap.id,
    ...tourData,
    tours_details: detailsList, // Frontend cần field này
  };
};