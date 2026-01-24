package com.reymelin.gradientclock;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Base64;
import android.util.Log;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.reymelin.gradientclock.widget.GradientClockWidgetProvider;
import com.reymelin.gradientclock.widget.GradientRenderer;

@CapacitorPlugin(name = "ClockSnapshot")
public class ClockSnapshotPlugin extends Plugin {

    @PluginMethod
    public void saveSnapshot(PluginCall call) {
        String dataUrl = call.getString("dataUrl");

        if (dataUrl == null) {
            call.reject("Missing dataUrl");
            return;
        }

        try {
            String base64Data = dataUrl;
            if (dataUrl.contains(",")) {
                base64Data = dataUrl.split(",")[1];
            }

            byte[] decodedBytes = Base64.decode(base64Data, Base64.DEFAULT);
            Bitmap bitmap = BitmapFactory.decodeByteArray(decodedBytes, 0, decodedBytes.length);

            if (bitmap == null) {
                call.reject("Failed to decode bitmap");
                return;
            }

            // Use the centralized save logic in GradientRenderer
            boolean ok = GradientRenderer.saveSnapshot(getContext(), bitmap);
            bitmap.recycle();

            if (ok) {
                // Trigger widget update immediately
                GradientClockWidgetProvider.updateAll(getContext());

                JSObject result = new JSObject();
                result.put("success", true);
                call.resolve(result);
            } else {
                call.reject("Failed to save snapshot to disk");
            }
        } catch (Exception e) {
            Log.e("ClockSnapshot", "Error saving snapshot", e);
            call.reject("Failed: " + e.getMessage());
        }
    }
}
