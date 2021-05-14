import 'package:flutter_test/flutter_test.dart';
import 'package:sample_shared_icons/sample_shared_icons.dart';

void main() {
  testWidgets('Icons CharCode', (WidgetTester tester) async {
    expect(SampleIcon.play.toString(), 'IconData(U+E000)');
    expect(SampleIcon.pause.toString(), 'IconData(U+E001)');
  });
}
