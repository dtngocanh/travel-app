import React, { useState, useEffect } from "react";
import { View, Text, Modal, TextInput, TouchableOpacity, ScrollView, Image, Alert, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { AddTourData, TourDetail, FileObject } from "../../utils/types";
import { addTourService } from "../../utils/api_admin";

interface CreateTourModalProps {
  visible: boolean;
  onClose: () => void;
  onCreated?: (newTour: any) => void;
}

const CLOUDINARY_CLOUD_NAME = "dhbuqqiuc";
const CLOUDINARY_UPLOAD_PRESET = "travel-app";

const FIXED_OPTIONS = {
  operator_name: ["Explore!", "Adventure Co.", "Mountain Tours"],
  tour_style_desc: ["Hiking & Trekking", "Cultural", "Adventure"],
  guide_type_desc: ["Fully Guided", "Self Guided", "Mixed"],
  intensity_desc: ["Easy", "Moderate", "Challenging"],
  language: ["English", "Vietnam", "English, Vietnam"],
  group_size: ["1-8", "1-16", "1-30"],
  age_range: ["All Ages", "18-30", "18-50", "30-60", "18-99"],
};

const CreateTourModal: React.FC<CreateTourModalProps> = ({ visible, onClose, onCreated }) => {
  const [name_tour, setNameTour] = useState("");
  const [price_tour, setPriceTour] = useState("");
  const [duration_tour, setDurationTour] = useState("");
  const [location_tour, setLocationTour] = useState("");
  const [image_tour, setImageTour] = useState<FileObject | string>("");

  const [operator_name, setOperatorName] = useState(FIXED_OPTIONS.operator_name[0]);
  const [tour_style_desc, setTourStyleDesc] = useState(FIXED_OPTIONS.tour_style_desc[0]);
  const [guide_type_desc, setGuideTypeDesc] = useState(FIXED_OPTIONS.guide_type_desc[0]);
  const [intensity_desc, setIntensityDesc] = useState(FIXED_OPTIONS.intensity_desc[2]);
  const [language, setLanguage] = useState(FIXED_OPTIONS.language[0]);
  const [group_size, setGroupSize] = useState(FIXED_OPTIONS.group_size[1]);
  const [age_range, setAgeRange] = useState(FIXED_OPTIONS.age_range[0]);

  const [details, setDetails] = useState<TourDetail[]>([]);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<{ price?: string; duration?: string }>({});

  // --- Update details array theo duration ---
  useEffect(() => {
    const days = parseInt(duration_tour) || 0;
    setDetails(prev => {
      const newDetails: TourDetail[] = [];
      for (let i = 0; i < days; i++) {
        newDetails.push(prev[i] || { itinerary_desc: "", itinerary_accommodation: "", itinerary_image: undefined });
      }
      return newDetails;
    });
  }, [duration_tour]);

  // --- Pick image function ---
  const pickImage = async (dayIndex?: number) => {
    try {
      if (Platform.OS === "web") {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = async () => {
          const file = input.files?.[0];
          if (!file) return;

          const cloudUrl = await uploadToCloudinary(file);
          if (!cloudUrl) return;

          if (dayIndex !== undefined) {
            setDetails(prev => prev.map((d, i) => i === dayIndex ? { ...d, itinerary_image: cloudUrl } : d));
          } else {
            setImageTour(cloudUrl);
          }
        };
        input.click();
        return;
      }

      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Bạn cần cấp quyền truy cập thư viện ảnh.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
      });

      if (!result.canceled && result.assets.length > 0) {
        const asset = result.assets[0];
        const fileObj: FileObject = {
          uri: asset.uri,
          name: asset.uri.split("/").pop(),
          type: asset.type === "image" ? "image/jpeg" : asset.type,
        };

        if (dayIndex !== undefined) {
          setDetails(prev => prev.map((d, i) => i === dayIndex ? { ...d, itinerary_image: fileObj } : d));
        } else {
          setImageTour(fileObj);
        }
      }
    } catch (error) {
      console.error("pickImage error:", error);
      Alert.alert("Error", "Không thể chọn ảnh, vui lòng thử lại.");
    }
  };

  const uploadToCloudinary = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      return data.secure_url || null;
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      Alert.alert("Error", "Không thể upload ảnh lên Cloudinary.");
      return null;
    }
  };

  // --- Realtime validation ---
  const handlePriceChange = (text: string) => {
    setPriceTour(text);
    if (!text) setErrors(prev => ({ ...prev, price: "Price is required" }));
    else if (isNaN(Number(text)) || Number(text) <= 0) setErrors(prev => ({ ...prev, price: "Price must be > 0" }));
    else setErrors(prev => ({ ...prev, price: undefined }));
  };

  const handleDurationChange = (text: string) => {
    setDurationTour(text);
    const num = Number(text);
    if (!text) setErrors(prev => ({ ...prev, duration: "Duration is required" }));
    else if (isNaN(num) || num <= 0 || num > 14) setErrors(prev => ({ ...prev, duration: "Duration must be 1-14" }));
    else setErrors(prev => ({ ...prev, duration: undefined }));
  };

  const handleDetailChange = (dayIndex: number, field: keyof TourDetail, value: string) => {
    setDetails(prev => prev.map((d, i) => i === dayIndex ? { ...d, [field]: value } : d));
  };

  // --- Submit ---
  const handleSubmit = async () => {
    if (loading) return;
    if (!name_tour || !price_tour || !duration_tour || !location_tour) {
      Alert.alert("Error", "Please fill all the form.");
      return;
    }
    if (errors.price || errors.duration) {
      Alert.alert("Error", "Please fix error before create tour.");
      return;
    }

    try {
      setLoading(true);
      const updatedDetails: TourDetail[] = details.map(d => ({
        ...d,
        operator_name,
        tour_style_desc,
        guide_type_desc,
        intensity_desc,
        language,
        group_size,
        age_range,
      }));

      const tourData: AddTourData = {
        name_tour,
        price_tour: Number(price_tour),
        duration_tour,
        location_tour,
        image_tour,
        details: updatedDetails,
      };

      const result = await addTourService(tourData);

      Alert.alert("Success", "Create tour successful!");
      onCreated?.(result);

      // reset all
      setNameTour("");
      setPriceTour("");
      setDurationTour("");
      setLocationTour("");
      setImageTour("");
      setDetails([]);
      setOperatorName(FIXED_OPTIONS.operator_name[0]);
      setTourStyleDesc(FIXED_OPTIONS.tour_style_desc[0]);
      setGuideTypeDesc(FIXED_OPTIONS.guide_type_desc[0]);
      setIntensityDesc(FIXED_OPTIONS.intensity_desc[2]);
      setLanguage(FIXED_OPTIONS.language[0]);
      setGroupSize(FIXED_OPTIONS.group_size[1]);
      setAgeRange(FIXED_OPTIONS.age_range[0]);
      setErrors({});
      onClose();
    } catch (error) {
      console.error("Create tour error:", error);
      Alert.alert("Error", "Can not create tour, Try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderSelect = (label: string, options: string[], value: string, setter: (v: string) => void) => (
    <View style={{ marginBottom: 12 }}>
      <Text style={{ fontWeight: "600", marginBottom: 4 }}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {options.map((opt, i) => (
          <TouchableOpacity
            key={`${label}-${opt}-${i}`}
            onPress={() => setter(opt)}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 6,
              marginRight: 8,
              borderRadius: 6,
              backgroundColor: opt === value ? "#2563EB" : "#E5E7EB",
            }}
          >
            <Text style={{ color: opt === value ? "#fff" : "#000" }}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={{ flex: 1, justifyContent: "center", backgroundColor: "rgba(0,0,0,0.5)", padding: 16 }}>
        <View style={{ backgroundColor: "#fff", borderRadius: 12, padding: 16, maxHeight: "90%" }}>
          <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 12 }}>Create Tour</Text>
          <ScrollView>
            <TextInput placeholder="Tour Name" value={name_tour} onChangeText={setNameTour} style={{ borderWidth: 1, borderColor: "#D1D5DB", borderRadius: 6, padding: 8, marginBottom: 12 }} />

            <TextInput
              placeholder="Price"
              value={price_tour}
              onChangeText={handlePriceChange}
              keyboardType="numeric"
              style={{ borderWidth: 1, borderColor: "#D1D5DB", borderRadius: 6, padding: 8, marginBottom: 4 }}
            />
            {errors.price && <Text style={{ color: "red", marginBottom: 8 }}>{errors.price}</Text>}

            <TextInput
              placeholder="Duration (days)"
              value={duration_tour}
              onChangeText={handleDurationChange}
              keyboardType="numeric"
              style={{ borderWidth: 1, borderColor: "#D1D5DB", borderRadius: 6, padding: 8, marginBottom: 4 }}
            />
            {errors.duration && <Text style={{ color: "red", marginBottom: 8 }}>{errors.duration}</Text>}

            <TextInput placeholder="Location" value={location_tour} onChangeText={setLocationTour} style={{ borderWidth: 1, borderColor: "#D1D5DB", borderRadius: 6, padding: 8, marginBottom: 12 }} />

            {image_tour && <Image source={{ uri: typeof image_tour === "string" ? image_tour : image_tour.uri }} style={{ width: "100%", height: 180, borderRadius: 8, marginBottom: 8 }} />}
            <TouchableOpacity onPress={() => pickImage()} style={{ backgroundColor: "#2563EB", padding: 8, borderRadius: 6, marginBottom: 12, alignItems: "center" }}>
              <Text style={{ color: "#fff", fontWeight: "600" }}>Choose Tour Image</Text>
            </TouchableOpacity>

            {renderSelect("Operator", FIXED_OPTIONS.operator_name, operator_name, setOperatorName)}
            {renderSelect("Tour Style", FIXED_OPTIONS.tour_style_desc, tour_style_desc, setTourStyleDesc)}
            {renderSelect("Guide Type", FIXED_OPTIONS.guide_type_desc, guide_type_desc, setGuideTypeDesc)}
            {renderSelect("Intensity", FIXED_OPTIONS.intensity_desc, intensity_desc, setIntensityDesc)}
            {renderSelect("Language", FIXED_OPTIONS.language, language, setLanguage)}
            {renderSelect("Group Size", FIXED_OPTIONS.group_size, group_size, setGroupSize)}
            {renderSelect("Age Range", FIXED_OPTIONS.age_range, age_range, setAgeRange)}

            {details.map((d, idx) => (
              <View key={`day-${idx}`} style={{ marginBottom: 12, padding: 8, borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 6 }}>
                <Text style={{ fontWeight: "600", marginBottom: 4 }}>{`Day ${idx + 1}`}</Text>
                <TextInput placeholder="Itinerary description" value={d.itinerary_desc} onChangeText={t => handleDetailChange(idx, "itinerary_desc", t)} style={{ borderWidth: 1, borderColor: "#D1D5DB", borderRadius: 6, padding: 6, marginBottom: 4 }} />
                <TextInput placeholder="Accommodation" value={d.itinerary_accommodation || ""} onChangeText={t => handleDetailChange(idx, "itinerary_accommodation", t)} style={{ borderWidth: 1, borderColor: "#D1D5DB", borderRadius: 6, padding: 6, marginBottom: 4 }} />
                {d.itinerary_image && <Image source={{ uri: typeof d.itinerary_image === "string" ? d.itinerary_image : d.itinerary_image.uri }} style={{ width: "100%", height: 120, borderRadius: 6, marginBottom: 4 }} />}
                <TouchableOpacity onPress={() => pickImage(idx)} style={{ backgroundColor: "#2563EB", padding: 6, borderRadius: 6, alignItems: "center" }}>
                  <Text style={{ color: "#fff", fontWeight: "600" }}>Choose Day Image</Text>
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity onPress={handleSubmit} style={{ backgroundColor: loading ? "#6EE7B7" : "#10B981", paddingVertical: 12, borderRadius: 8, alignItems: "center", marginTop: 12 }} disabled={loading}>
              <Text style={{ color: "#fff", fontWeight: "700" }}>{loading ? "Creating..." : "Create Tour"}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onClose} style={{ marginTop: 8, alignItems: "center" }}>
              <Text style={{ color: "#6B7280", fontWeight: "600" }}>Cancel</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default CreateTourModal;
