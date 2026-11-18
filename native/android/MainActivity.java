package com.safekid.parent.test;
import android.os.Bundle;
import android.graphics.Color;
import android.view.WindowManager;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
 @Override public void onCreate(Bundle savedInstanceState) {
  super.onCreate(savedInstanceState);
  WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
  getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE);
  android.view.View content = findViewById(android.R.id.content);
  content.setBackgroundColor(Color.rgb(242, 250, 249));
  ViewCompat.setOnApplyWindowInsetsListener(content, (view, insets) -> {
   Insets bars=insets.getInsets(WindowInsetsCompat.Type.systemBars() | WindowInsetsCompat.Type.displayCutout());
   Insets keyboard=insets.getInsets(WindowInsetsCompat.Type.ime());
   view.setPadding(bars.left,bars.top,bars.right,Math.max(bars.bottom,keyboard.bottom));
   return WindowInsetsCompat.CONSUMED;
  });
  ViewCompat.requestApplyInsets(content);
 }
}
