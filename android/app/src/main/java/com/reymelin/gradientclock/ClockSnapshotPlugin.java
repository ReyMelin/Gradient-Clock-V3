package com.reymelin.gradientclock;

import android.content.Context;
import android.util.Base64;
import android.util.Log;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.File;
import java.io.FileOutputStream;

@CapacitorPlugin(name = "Snapshot")
public class ClockSnapshotPlugin extends Plugin {

    private static final String TAG = "SnapshotPlugin";
    private static final String FILENAME = "clock_snapshot.png";

    @PluginMethod
    public void savePngBase64(PluginCall call) {
        String dataUrlOrBase64 = call.getString("data");
        Log.d(TAG, "savePngBase64 called. Data received: " + (dataUrlOrBase64 != null ? "YES" : "NO"));

        if (dataUrlOrBase64 == null || dataUrlOrBase64.isEmpty()) {
            call.reject("Missing 'data'");
            return;
        }

        try {
            String base64 = dataUrlOrBase64;
            int comma = base64.indexOf(',');
            if (base64.startsWith("data:") && comma >= 0) {
                base64 = base64.substring(comma + 1);
            }

            byte[] bytes = Base64.decode(base64, Base64.DEFAULT);

            Context ctx = getContext();
            File outFile = new File(ctx.getFilesDir(), FILENAME);

            try (FileOutputStream fos = new FileOutputStream(outFile, false)) {
                fos.write(bytes);
                fos.flush();
            }

            long len = outFile.length();
            Log.d(TAG, "SUCCESS! Snapshot saved to: " + outFile.getAbsolutePath() + " (" + len + " bytes)");

            JSObject ret = new JSObject();
            ret.put("path", outFile.getAbsolutePath());
            ret.put("success", true);
            call.resolve(ret);

            // Notify the widget to update immediately now that a new image exists
            com.reymelin.gradientclock.widget.GradientClockWidgetProvider.updateAll(ctx);

        } catch (Exception e) {
            Log.e(TAG, "CRITICAL: Failed saving snapshot", e);
            call.reject("Failed saving snapshot: " + e.getMessage());
        }
    }
}
