package com.bootlegsoft.accuwa.splash.animations;

import android.view.animation.Animation;

public interface SplashAnimation {
  Animation create(Config config);

  public class Config {
    int duration;

    public Config(int duration) {
      this.duration = duration;
    }
  }
}
