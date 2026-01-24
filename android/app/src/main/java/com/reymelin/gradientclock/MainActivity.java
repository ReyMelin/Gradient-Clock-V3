package com.reymelin.gradientclock;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import com.reymelin.gradientclock.bridge.ClockSnapshotPlugin;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        registerPlugin(ClockSnapshotPlugin.class);
    }
}
