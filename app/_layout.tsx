import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />
      <Stack.Screen
        name="[name]"
        options={{
          title: "Details",
          headerBackButtonDisplayMode: "minimal",
          presentation: "formSheet",
          sheetGrabberVisible: true,
          headerShown: false,
        }}
      />
    </Stack>
  );
}
