import React, { useState, useEffect } from "react";
import {
  View, Text, Modal, TextInput, TouchableOpacity, ScrollView,
  Image, Alert, Platform, ActivityIndicator, KeyboardAvoidingView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { updateTourService, getTourDetailService } from "../../utils/api_admin";
import { FileObject } from "../../utils/types";

interface UpdateTourModalProps {
  visible: boolean;
  tour: any;
  onClose: () => void;
  onUpdated?: (tour: any) => void;
}

const FIXED_OPTIONS = {
  operator_name: ["Explore!", "Adventure Co.", "Mountain Tours"],
  tour_style_desc: ["Hiking & Trekking", "Cultural", "Adventure", "Marine"],
  guide_type_desc: ["Fully Guided", "Self Guided", "Mixed"],
  intensity_desc: ["Easy", "Moderate", "Challenging"],
  language: ["English", "Vietnamese", "English, Vietnamese"],
  group_size: ["1-8", "1-16", "1-30"],
  age_range: ["All Ages", "18-30", "18-50", "30-60", "18-99"],
};

const UpdateTourModal: React.FC<UpdateTourModalProps> = ({ visible, tour, onClose, onUpdated }) => {
  // --- Mode State ---
  const [isEditing, setIsEditing] = useState(false); // Mặc định là xem

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [location, setLocation] = useState("");
  const [imageTour, setImageTour] = useState<FileObject | string | null>(null);

  const [operatorName, setOperatorName] = useState("");
  const [tourStyle, setTourStyle] = useState("");
  const [guideType, setGuideType] = useState("");
  const [intensity, setIntensity] = useState("");
  const [language, setLanguage] = useState("");
  const [groupSize, setGroupSize] = useState("");
  const [ageRange, setAgeRange] = useState("");

  const [details, setDetails] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Load Data
  useEffect(() => {
    const fetchFullData = async () => {
      if (tour?.id && visible) {
        setLoading(true);
        setIsEditing(false); // Reset về mode xem mỗi khi mở modal
        try {
          const fullData = await getTourDetailService(tour.id);
          setName(fullData.name_tour || "");
          setPrice(String(fullData.price_tour || ""));
          setDuration(String(fullData.duration_tour || ""));
          setLocation(fullData.location_tour || "");
          setImageTour(fullData.image_tour || null);

          const tourDetails = fullData.tours_details || [];
          setDetails(tourDetails);

          if (tourDetails.length > 0) {
            const f = tourDetails[0];
            setOperatorName(f.operator_name || FIXED_OPTIONS.operator_name[0]);
            setTourStyle(f.tour_style_desc || FIXED_OPTIONS.tour_style_desc[0]);
            setGuideType(f.guide_type_desc || FIXED_OPTIONS.guide_type_desc[0]);
            setIntensity(f.intensity_desc || FIXED_OPTIONS.intensity_desc[0]);
            setLanguage(f.language || FIXED_OPTIONS.language[0]);
            setGroupSize(f.group_size || FIXED_OPTIONS.group_size[0]);
            setAgeRange(f.age_range || FIXED_OPTIONS.age_range[0]);
          }
        } catch (error) {
          console.error("Load error", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchFullData();
  }, [tour, visible]);

  const pickImage = async (dayIndex?: number) => {
    if (!isEditing) return; // Chặn chọn ảnh khi đang xem
    try {
      if (Platform.OS === "web") {
        const input = document.createElement("input");
        input.type = "file"; input.accept = "image/*";
        input.onchange = async () => {
          const file = input.files?.[0];
          if (!file) return;
          const fileObj: any = { uri: URL.createObjectURL(file), name: file.name, type: file.type, file: file };
          if (dayIndex !== undefined) setDetails((p) => p.map((d, i) => (i === dayIndex ? { ...d, itinerary_image: fileObj } : d)));
          else setImageTour(fileObj);
        };
        input.click();
        return;
      }
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") return;
      const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7 });
      if (!res.canceled) {
        const asset = res.assets[0];
        const fileObj: FileObject = { uri: asset.uri, name: asset.uri.split("/").pop() || "image.jpg", type: "image/jpeg" };
        if (dayIndex !== undefined) setDetails((p) => p.map((d, i) => (i === dayIndex ? { ...d, itinerary_image: fileObj } : d)));
        else setImageTour(fileObj);
      }
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async () => {
    if (!name || !price) { Alert.alert("Error", "Missing fields"); return; }
    setLoading(true);
    try {
      const finalDetails = details.map((d, index) => ({
        id: d.id,
        itinerary_day: d.itinerary_day || `Day ${index + 1}`,
        itinerary_desc: d.itinerary_desc,
        itinerary_accommodation: d.itinerary_accommodation,
        itinerary_image: typeof d.itinerary_image === "string" ? d.itinerary_image : null,
        operator_name: operatorName, tour_style_desc: tourStyle, guide_type_desc: guideType,
        intensity_desc: intensity, language: language, group_size: groupSize, age_range: ageRange,
      }));

      const tourData = {
        name_tour: name, price_tour: Number(price), duration_tour: duration, location_tour: location,
        image_tour: typeof imageTour === "string" ? imageTour : undefined, details: finalDetails,
      };

      const filesToSend: any[] = [];
      if (imageTour && typeof imageTour !== "string") filesToSend.push({ ...imageTour, fieldname: "image_tour" });
      details.forEach((d, index) => {
        if (d.itinerary_image && typeof d.itinerary_image !== "string") filesToSend.push({ ...d.itinerary_image, fieldname: `itinerary_image_${index}` });
      });

      const response = await updateTourService(tour.id, tourData, filesToSend);
      Alert.alert("Success", "Tour updated!");
      if (onUpdated && response.data) onUpdated(response.data);
      onClose();
    } catch (err: any) { Alert.alert("Error", err.message); } finally { setLoading(false); }
  };

  // Helper render input style
  const inputStyle = `border rounded-lg p-3 mb-3 text-sm ${isEditing ? 'border-gray-300 bg-white' : 'border-transparent bg-gray-100 text-gray-800'}`;

  const renderSelect = (label: string, options: string[], value: string, setter: (v: string) => void) => (
    <View className="mb-3">
      <Text className="text-xs font-bold text-gray-700 mb-1">{label}</Text>
      {isEditing ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {options.map((opt, i) => (
            <TouchableOpacity key={i} onPress={() => setter(opt)} className={`px-4 py-2 rounded-full mr-2 border ${opt === value ? "bg-blue-600 border-blue-600" : "bg-gray-100 border-gray-200"}`}>
              <Text className={`text-xs ${opt === value ? "text-white font-bold" : "text-gray-700"}`}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <View className="bg-gray-100 p-3 rounded-lg"><Text className="text-gray-800">{value}</Text></View>
      )}
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 bg-black/50 justify-end">
        <View className="bg-white h-[92%] rounded-t-3xl overflow-hidden">
          <View className="flex-row justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
            <Text className="text-lg font-bold text-gray-800">{isEditing ? "Editing Tour" : "Tour Details"}</Text>
            <TouchableOpacity onPress={onClose}><Text className="text-red-500 font-semibold">Close</Text></TouchableOpacity>
          </View>

          <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
            {loading && details.length === 0 ? (
              <ActivityIndicator size="large" color="#2563eb" className="mt-10" />
            ) : (
              <>
                <Text className="text-lg font-bold text-blue-800 mb-2 mt-2">1. General Info</Text>
                <TextInput editable={isEditing} placeholder="Tour Name" value={name} onChangeText={setName} className={inputStyle} />
                <View className="flex-row gap-2">
                  <TextInput editable={isEditing} placeholder="Price" value={price} onChangeText={setPrice} keyboardType="numeric" className={`flex-1 ${inputStyle}`} />
                  <TextInput editable={false} value={duration} className="flex-1 border border-transparent bg-gray-200 rounded-lg p-3 mb-3 text-gray-500" />
                </View>
                <TextInput editable={isEditing} placeholder="Location" value={location} onChangeText={setLocation} className={inputStyle} />

                <Text className="text-xs font-bold text-gray-700 mb-1">Cover Image</Text>
                <TouchableOpacity onPress={() => pickImage()} disabled={!isEditing} className="mb-4">
                  {imageTour ? (
                    <Image source={{ uri: typeof imageTour === "string" ? imageTour : imageTour.uri }} className="w-full h-48 rounded-lg bg-gray-100" resizeMode="cover" />
                  ) : (
                    <View className="w-full h-36 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg justify-center items-center">
                      <Text className="text-gray-400 text-sm">{isEditing ? "+ Select Cover Image" : "No Image"}</Text>
                    </View>
                  )}
                  {isEditing && <View className="absolute bottom-2 right-2 bg-black/60 px-2 py-1 rounded"><Text className="text-white text-xs">Change</Text></View>}
                </TouchableOpacity>

                <View className="h-[1px] bg-gray-200 my-4" />
                <Text className="text-lg font-bold text-blue-800 mb-1">2. Settings</Text>
                {renderSelect("Operator", FIXED_OPTIONS.operator_name, operatorName, setOperatorName)}
                {renderSelect("Tour Style", FIXED_OPTIONS.tour_style_desc, tourStyle, setTourStyle)}
                {renderSelect("Guide Type", FIXED_OPTIONS.guide_type_desc, guideType, setGuideType)}
                {renderSelect("Intensity", FIXED_OPTIONS.intensity_desc, intensity, setIntensity)}
                {renderSelect("Language", FIXED_OPTIONS.language, language, setLanguage)}
                {renderSelect("Group Size", FIXED_OPTIONS.group_size, groupSize, setGroupSize)}
                {renderSelect("Age Range", FIXED_OPTIONS.age_range, ageRange, setAgeRange)}

                <View className="h-[1px] bg-gray-200 my-4" />
                <Text className="text-lg font-bold text-blue-800 mb-4">3. Itinerary</Text>
                {details.map((d, idx) => (
                  <View key={idx} className="border border-gray-200 rounded-xl mb-5 bg-white shadow-sm overflow-hidden">
                    <View className="bg-gray-50 p-3 border-b border-gray-100"><Text className="font-bold text-gray-700">Day {idx + 1}: {d.itinerary_day}</Text></View>
                    <View className="p-3">
                      <Text className="text-xs font-bold text-gray-700 mb-1">Description</Text>
                      <TextInput editable={isEditing} multiline value={d.itinerary_desc} onChangeText={(t) => setDetails((prev) => prev.map((item, i) => (i === idx ? { ...item, itinerary_desc: t } : item)))} className={`${inputStyle} h-20`} style={{ textAlignVertical: "top" }} />
                      <Text className="text-xs font-bold text-gray-700 mb-1">Accommodation</Text>
                      <TextInput editable={isEditing} value={d.itinerary_accommodation} onChangeText={(t) => setDetails((prev) => prev.map((item, i) => (i === idx ? { ...item, itinerary_accommodation: t } : item)))} className={inputStyle} />
                      <Text className="text-xs font-bold text-gray-700 mb-1">Image</Text>
                      <TouchableOpacity onPress={() => pickImage(idx)} disabled={!isEditing} className="mt-1">
                        {d.itinerary_image ? (
                          <Image source={{ uri: typeof d.itinerary_image === "string" ? d.itinerary_image : d.itinerary_image.uri }} className="w-full h-32 rounded-lg bg-gray-100" resizeMode="cover" />
                        ) : (
                          <View className="w-full h-24 bg-gray-50 border border-dashed border-gray-300 rounded-lg justify-center items-center"><Text className="text-gray-400 text-xs">{isEditing ? "+ Add Image" : "No Image"}</Text></View>
                        )}
                        {isEditing && <View className="absolute bottom-2 right-2 bg-black/60 px-2 py-1 rounded"><Text className="text-white text-xs">Change</Text></View>}
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </>
            )}
          </ScrollView>

          <View className="p-4 border-t border-gray-100 bg-white flex-row gap-3">
            {!isEditing ? (
              <TouchableOpacity onPress={() => setIsEditing(true)} className="flex-1 bg-blue-600 py-3.5 rounded-xl items-center">
                <Text className="text-white font-bold text-base">Edit Tour</Text>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity onPress={() => setIsEditing(false)} className="flex-1 bg-gray-200 py-3.5 rounded-xl items-center">
                  <Text className="text-gray-700 font-bold text-base">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSubmit} disabled={loading} className="flex-1 bg-green-600 py-3.5 rounded-xl items-center">
                  {loading ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-bold text-base">Save</Text>}
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default UpdateTourModal;