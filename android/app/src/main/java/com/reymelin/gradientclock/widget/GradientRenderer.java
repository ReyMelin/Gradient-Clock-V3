package com.reymelin.gradientclock.widget;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.PorterDuff;
import android.graphics.PorterDuffXfermode;
import android.util.Log;
import java.io.File;
import java.io.FileOutputStream;

public class GradientRenderer {

    // Must match ClockSnapshotPlugin.FILENAME
    private static final String SNAPSHOT_FILENAME = "clock_snapshot.png";

    public static boolean saveSnapshot(Context context, Bitmap bmp) {
        if (bmp == null) return false;
        File outFile = new File(context.getFilesDir(), SNAPSHOT_FILENAME);
        try (FileOutputStream fos = new FileOutputStream(outFile)) {
            boolean ok = bmp.compress(Bitmap.CompressFormat.PNG, 100, fos);
            fos.flush();
            Log.d("GradientRenderer", "Manual snapshot saved: " + outFile.getAbsolutePath() + " ok=" + ok);
            return ok;
        } catch (Exception e) {
            Log.e("GradientRenderer", "Failed manual save", e);
            return false;
        }
    }

    public static Bitmap renderWidgetBitmap(Context context, int width, int height) {
        File snapshotFile = new File(context.getFilesDir(), SNAPSHOT_FILENAME);

        if (!snapshotFile.exists()) {
            Log.e("GradientRenderer", "Snapshot FILE MISSING at " + snapshotFile.getAbsolutePath());
            return createErrorBitmap(width, height, Color.RED); // Red = Missing
        }

        if (snapshotFile.length() == 0) {
            Log.e("GradientRenderer", "Snapshot FILE EMPTY at " + snapshotFile.getAbsolutePath());
            return createErrorBitmap(width, height, Color.YELLOW); // Yellow = Empty
        }

        try {
            Bitmap snapshot = BitmapFactory.decodeFile(snapshotFile.getAbsolutePath());
            if (snapshot != null) {
                int size = Math.min(width, height);
                Bitmap output = Bitmap.createBitmap(size, size, Bitmap.Config.ARGB_8888);
                Canvas canvas = new Canvas(output);
                
                int paddedSize = (int) (size * 0.98f);
                int margin = (size - paddedSize) / 2;

                Bitmap scaled = Bitmap.createScaledBitmap(snapshot, paddedSize, paddedSize, true);

                final Paint paint = new Paint();
                paint.setAntiAlias(true);
                
                // Draw circular mask
                canvas.drawARGB(0, 0, 0, 0);
                canvas.drawCircle(size / 2f, size / 2f, paddedSize / 2f, paint);
                
                // Overlay the snapshot inside the circle
                paint.setXfermode(new PorterDuffXfermode(PorterDuff.Mode.SRC_IN));
                canvas.drawBitmap(scaled, margin, margin, paint);

                if (scaled != snapshot) scaled.recycle();
                snapshot.recycle();

                Log.d("GradientRenderer", "Snapshot rendered successfully: " + snapshotFile.getAbsolutePath());
                return output;
            }
        } catch (Exception e) {
            Log.e("GradientRenderer", "Failed to decode snapshot", e);
        }

        return createErrorBitmap(width, height, Color.MAGENTA); // Magenta = Decode Error
    }

    private static Bitmap createErrorBitmap(int width, int height, int color) {
        int size = Math.min(width, height);
        Bitmap bmp = Bitmap.createBitmap(size, size, Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(bmp);
        Paint paint = new Paint();
        paint.setColor(color);
        paint.setAntiAlias(true);
        canvas.drawCircle(size / 2f, size / 2f, size / 3f, paint);
        return bmp;
    }
}
