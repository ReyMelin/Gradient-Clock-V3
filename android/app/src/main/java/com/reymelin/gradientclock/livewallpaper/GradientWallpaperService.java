package com.reymelin.gradientclock.livewallpaper;

import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.os.Handler;
import android.service.wallpaper.WallpaperService;
import android.view.SurfaceHolder;

import com.reymelin.gradientclock.widget.GradientRenderer;

public class GradientWallpaperService extends WallpaperService {

    @Override
    public Engine onCreateEngine() {
        return new GradientEngine();
    }

    private class GradientEngine extends Engine {
        private final Handler handler = new Handler();
        private final Runnable drawRunner = this::draw;
        private boolean visible;

        @Override
        public void onVisibilityChanged(boolean visible) {
            this.visible = visible;
            if (visible) {
                handler.post(drawRunner);
            } else {
                handler.removeCallbacks(drawRunner);
            }
        }

        @Override
        public void onSurfaceDestroyed(SurfaceHolder holder) {
            super.onSurfaceDestroyed(holder);
            this.visible = false;
            handler.removeCallbacks(drawRunner);
        }

        @Override
        public void onSurfaceChanged(SurfaceHolder holder, int format, int width, int height) {
            super.onSurfaceChanged(holder, format, width, height);
            handler.post(drawRunner);
        }

        private void draw() {
            SurfaceHolder holder = getSurfaceHolder();
            Canvas canvas = null;
            try {
                canvas = holder.lockCanvas();
                if (canvas != null) {
                    int width = canvas.getWidth();
                    int height = canvas.getHeight();

                    // Render the clock bitmap using existing renderer
                    Bitmap bmp = GradientRenderer.renderWidgetBitmap(getApplicationContext(), width, height);
                    
                    // Fill background with black (or any base color)
                    canvas.drawColor(android.graphics.Color.BLACK);
                    
                    // Draw the clock in the center
                    float left = (width - bmp.getWidth()) / 2f;
                    float top = (height - bmp.getHeight()) / 2f;
                    canvas.drawBitmap(bmp, left, top, new Paint());
                    
                    bmp.recycle();
                }
            } finally {
                if (canvas != null) {
                    holder.unlockCanvasAndPost(canvas);
                }
            }

            handler.removeCallbacks(drawRunner);
            if (visible) {
                // Update every minute (60000ms) or more frequently if desired
                handler.postDelayed(drawRunner, 60000);
            }
        }
    }
}
