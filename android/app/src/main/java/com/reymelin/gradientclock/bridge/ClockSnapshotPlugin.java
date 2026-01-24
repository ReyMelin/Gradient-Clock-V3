package com.reymelin.gradientclock.bridge;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Base64;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.reymelin.gradientclock.widget.GradientRenderer;
import com.reymelin.gradientclock.widget.GradientClockWidgetProvider;

import java.io.ByteArrayInputStream;

@CapacitorPlugin(name = "ClockSnapshot")
public class ClockSnapshotPlugin extends Plugin {

    @PluginMethod
    public void saveSnapshot(PluginCall call) {
        String dataUrl = call.getString("dataUrl");

        if (dataUrl == null || !dataUrl.contains(",")) {
            call.reject("Invalid dataUrl");
            return;
        }

        try {
            String base64 = dataUrl.substring(dataUrl.indexOf(",") + 1);
            byte[] bytes = Base64.decode(base64, Base64.DEFAULT);
            Bitmap bmp = BitmapFactory.decodeStream(new ByteArrayInputStream(bytes));

            boolean ok = GradientRenderer.saveSnapshot(getContext(), bmp);
            if (bmp != null) bmp.recycle();

            if (ok) {
                GradientClockWidgetProvider.updateAll(getContext());
                call.resolve();
            } else {
                call.reject("Snapshot save failed");
            }

        } catch (Exception e) {
            call.reject(e.getMessage());
        }
    }
}