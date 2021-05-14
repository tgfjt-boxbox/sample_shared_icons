library sample_icon;

import 'package:flutter/widgets.dart';

// !!AUTOMATICALLY GENERATED!!

class IconDataSample extends IconData {
  const IconDataSample(int codePoint)
      : super(
          codePoint,
          fontFamily: 'SampleIcon',
          fontPackage: "sample_shared_icons",
        );
}

/// Icons based on SampleIcon font
class SampleIcon {
  /// play Icon
  static const IconData play = const IconDataSample(0xE000);
  /// pause Icon
  static const IconData pause = const IconDataSample(0xE001);
}
