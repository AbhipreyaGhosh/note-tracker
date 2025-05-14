// import { Ionicons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import * as FileSystem from "expo-file-system";
// import * as ImagePicker from "expo-image-picker";
// import * as MediaLibrary from "expo-media-library";
// import React, { useEffect, useState } from "react";
// import {
//   Alert,
//   Button,
//   FlatList,
//   Image,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";

// export default function HomeScreen() {
//   const [imageUri, setImageUri] = useState<string | null>(null);
//   const [application, setApplication] = useState("");
//   const [password, setPassword] = useState("");
//   const [entries, setEntries] = useState<{ app: string; password: string }[]>(
//     []
//   );
//   const [showPassword, setShowPassword] = useState(false);

//   const pickAndStoreImage = async () => {
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       quality: 1,
//     });

//     if (!result.canceled) {
//       if (!FileSystem.documentDirectory) {
//         console.error("Document directory is not available");
//         return;
//       }

//       const pickedUri = result.assets[0].uri;
//       const fileName = pickedUri.split("/").pop() || `image_${Date.now()}.heic`;
//       const privateUri = FileSystem.documentDirectory + fileName;

//       await FileSystem.copyAsync({
//         from: pickedUri,
//         to: privateUri,
//       });

//       setImageUri(privateUri);

//       Alert.alert("Saved privately!", "Image stored in app only.");
//     }
//   };

//   // Export image back to gallery
//   const exportImageToGallery = async () => {
//     if (!imageUri) return;

//     const permission = await MediaLibrary.requestPermissionsAsync();
//     if (!permission.granted) {
//       Alert.alert("Permission denied", "Cannot access media library.");
//       return;
//     }

//     const asset = await MediaLibrary.createAssetAsync(imageUri);
//     await MediaLibrary.createAlbumAsync("AppExports", asset, false);

//     Alert.alert("Exported", "Image is now in your gallery!");
//   };

//   // Load saved entries
//   useEffect(() => {
//     const loadEntries = async () => {
//       try {
//         const saved = await AsyncStorage.getItem("entries");
//         if (saved) {
//           setEntries(JSON.parse(saved));
//         }
//       } catch (err) {
//         console.error("Failed to load entries", err);
//       }
//     };

//     loadEntries();
//   }, []);

//   // Save a new entry
//   const saveEntry = async () => {
//     if (!application.trim() || !password.trim()) {
//       Alert.alert("Missing Info", "Please fill in both fields.");
//       return;
//     }

//     const newEntry = { app: application, password };
//     const updatedEntries = [...entries, newEntry];
//     setEntries(updatedEntries);
//     setApplication("");
//     setPassword("");

//     try {
//       await AsyncStorage.setItem("entries", JSON.stringify(updatedEntries));
//     } catch (err) {
//       console.error("Save failed", err);
//     }
//   };

//   // Remove an entry
//   const removeEntry = async (index: number) => {
//     const filtered = entries.filter((_, i) => i !== index);
//     setEntries(filtered);
//     try {
//       await AsyncStorage.setItem("entries", JSON.stringify(filtered));
//     } catch (err) {
//       console.error("Delete failed", err);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>🔐 Password Manager</Text>

//       <TextInput
//         style={styles.input}
//         placeholder="Application name"
//         placeholderTextColor="#999"
//         value={application}
//         onChangeText={setApplication}
//       />

//       <View style={styles.passwordContainer}>
//         <TextInput
//           style={styles.passwordInput}
//           placeholder="Password"
//           placeholderTextColor="#999"
//           secureTextEntry={!showPassword}
//           value={password}
//           onChangeText={setPassword}
//         />
//         <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
//           <Ionicons
//             name={showPassword ? "eye-off" : "eye"}
//             size={24}
//             color="#555"
//           />
//         </TouchableOpacity>
//       </View>

//       <Button title="Save Entry" onPress={saveEntry} color="#007AFF" />

//       <FlatList
//         data={entries}
//         keyExtractor={(_, i) => i.toString()}
//         style={{ marginTop: 20 }}
//         renderItem={({ item, index }) => (
//           <View style={styles.entry}>
//             <Text style={styles.entryText}>
//               <Text style={styles.appName}>{item.app}</Text>: {item.password}
//             </Text>
//             <TouchableOpacity
//               onPress={() => removeEntry(index)}
//               style={styles.deleteButton}
//             >
//               <Text style={styles.deleteButtonText}>Delete</Text>
//             </TouchableOpacity>
//           </View>
//         )}
//       />
//       <View style={{ marginTop: 30 }}>
//         <Button
//           title="Pick Image & Save Privately"
//           onPress={pickAndStoreImage}
//           color="#34C759"
//         />

//         {imageUri && (
//           <>
//             <Image
//               source={{ uri: imageUri }}
//               style={{ width: 200, height: 200, marginTop: 20 }}
//             />
//             <Button
//               title="Export to Gallery"
//               onPress={exportImageToGallery}
//               color="#007AFF"
//             />
//           </>
//         )}
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingTop: 120,
//     padding: 20,
//     backgroundColor: "#F2F2F2",
//   },
//   header: {
//     fontSize: 28,
//     fontWeight: "bold",
//     marginBottom: 20,
//     textAlign: "center",
//     color: "#333",
//   },
//   input: {
//     backgroundColor: "#fff",
//     padding: 12,
//     fontSize: 16,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     marginBottom: 15,
//   },
//   passwordContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#fff",
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     paddingHorizontal: 10,
//     marginBottom: 15,
//   },
//   passwordInput: {
//     flex: 1,
//     height: 45,
//     fontSize: 16,
//   },
//   entry: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     backgroundColor: "#fff",
//     padding: 15,
//     borderRadius: 8,
//     marginBottom: 10,
//     elevation: 2,
//   },
//   entryText: {
//     fontSize: 16,
//     color: "#333",
//   },
//   appName: {
//     fontWeight: "bold",
//     color: "#111",
//   },
//   deleteButton: {
//     backgroundColor: "#FF3B30",
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     borderRadius: 5,
//     justifyContent: "center",
//   },
//   deleteButtonText: {
//     color: "#fff",
//     fontSize: 14,
//   },
// });


// image store


import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import React, { useState } from "react";
import { Alert, Button, FlatList, Image, StyleSheet, View } from "react-native";

export default function HomeScreen() {
  const [imageUris, setImageUris] = useState<string[]>([]);

  // Pick and store images privately in the app's file system
  const pickAndStoreImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsMultipleSelection: true,
    });

    if (!result.canceled && result.assets.length > 0) {
      if (!FileSystem.documentDirectory) {
        console.error("Document directory is not available");
        return;
      }

      // Request media library permissions
      const permission = await MediaLibrary.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permission denied", "Cannot delete from gallery.");
        return;
      }

      const newImageUris: string[] = [];

      for (const asset of result.assets) {
        const pickedUri = asset.uri;
        const fileName =
          pickedUri.split("/").pop() || `image_${Date.now()}.heic`;
        const privateUri = FileSystem.documentDirectory + fileName;

        await FileSystem.copyAsync({
          from: pickedUri,
          to: privateUri,
        });

        newImageUris.push(privateUri);

        // Try to find and delete the corresponding asset from the gallery
        try {
          const { assets } = await MediaLibrary.getAssetsAsync({
            first: 1,
            mediaType: "photo",
            createdAfter: Date.now() - 10000, // within last 10s
            sortBy: [["creationTime", false]],
          });

          const matchedAsset = assets.find((a) => a.uri === pickedUri);

          if (matchedAsset) {
            await MediaLibrary.deleteAssetsAsync([matchedAsset.id]);
          } else {
            console.warn(
              "No matching gallery asset found to delete:",
              pickedUri
            );
          }
        } catch (error) {
          console.error("Failed to delete from gallery:", error);
        }
      }

      setImageUris((prevUris) => [...prevUris, ...newImageUris]);

      Alert.alert(
        "Stored & Deleted",
        `${newImageUris.length} image(s) stored privately and deleted from gallery.`
      );
    }
  };

  // Export image back to the gallery
  const exportImageToGallery = async (uri: string) => {
    const permission = await MediaLibrary.requestPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission denied", "Cannot access media library.");
      return;
    }

    try {
      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync("AppExports", asset, false);

      // Delete from app file system
      await FileSystem.deleteAsync(uri);

      // Remove from local state so it disappears from UI
      setImageUris((prevUris) => prevUris.filter((item) => item !== uri));

      Alert.alert(
        "Exported and Deleted",
        "Image is now in your gallery and deleted from the app."
      );
    } catch (error) {
      console.error("Error during export/delete:", error);
      Alert.alert(
        "Error",
        "Something went wrong while exporting or deleting the image."
      );
    }
  };

  return (
    <View style={styles.container}>
      <Button
        title="Pick Images & Save Privately"
        onPress={pickAndStoreImage}
        color="#34C759"
      />

      {imageUris.length > 0 && (
        <FlatList
          data={imageUris}
          keyExtractor={(item, index) => index.toString()}
          numColumns={3}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item }} style={styles.image} />
              <Button
                title="Export to Gallery"
                onPress={() => exportImageToGallery(item)}
                color="#007AFF"
              />
            </View>
          )}
          contentContainerStyle={styles.imageContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 120,
    padding: 20,
    backgroundColor: "#F2F2F2",
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 10,
    margin: 10,
    borderRadius: 8,
    elevation: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
    borderRadius: 8,
  },
});
