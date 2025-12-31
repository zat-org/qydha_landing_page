import { defineStore } from "pinia";

// Helper function to generate device fingerprint
function generateDeviceFingerprint(): string {
  if (typeof window === 'undefined') return '';
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx?.fillText('Device fingerprint', 2, 2);
  const canvasHash = canvas.toDataURL();
  
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    canvasHash.substring(0, 50), // Canvas fingerprint
  ].join('|');
  
  // Create a simple hash
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

export const useMyClientInfoStore = defineStore(
  "clientInfo",
  () => {
    const clientInfo = reactive({
      enviroment:
        process.env.NODE_ENV === "production" ? "production" : "staging",
      platform: "web",
      appVersion: process.env.App_VERSION ?? "1.0.0",
      deviceId: "",
      deviceFingerprint: "", // Device fingerprint for uniqueness
      userAgent: "", // Browser user agent
      screenResolution: "", // Screen resolution
      timezone: "", // Timezone
      language: "", // Browser language
    });
    
    const Init = () => {
      if (process.client) {
        // Initialize deviceId if not exists
        if (!clientInfo.deviceId) {
          clientInfo.deviceId = crypto.randomUUID();
        }
        
        // Collect device-specific information
        clientInfo.userAgent = navigator.userAgent;
        clientInfo.screenResolution = `${screen.width}x${screen.height}`;
        clientInfo.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        clientInfo.language = navigator.language;
        
        // Generate device fingerprint
        if (!clientInfo.deviceFingerprint) {
          clientInfo.deviceFingerprint = generateDeviceFingerprint();
        }
      }
    };
    
    return { clientInfo, Init };
  },
  {
    persist: {
      storage: piniaPluginPersistedstate.localStorage(),
    },
  }
);
