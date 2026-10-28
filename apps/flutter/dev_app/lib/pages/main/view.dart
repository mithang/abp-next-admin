import 'package:dev_app/pages/public/index.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

import 'controller.dart';

class MainPage extends GetView<MainController> {
  const MainPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      bottomNavigationBar: Obx(() => BottomNavigationBar(
        onTap: (int index) {
          controller.setCurrentIndex(index);
        },
        currentIndex: controller.currentIndex,
        items: [
          _bottomNavigationBarItem(Icons.home, 'Page:Home'.tr),
          _bottomNavigationBarItem(Icons.layers, 'Page:Work'.tr),
          _bottomNavigationBarItem(Icons.person, 'Page:Center'.tr),
        ],
      )),
      body: Obx(() => <Widget>[
        Container(
          alignment: Alignment.center,
          child: const HomePage(),
        ),
        Container(
          alignment: Alignment.center,
          child: const WorkPage(),
        ),
        Container(
          alignment: Alignment.center,
          child: const CenterPage(),
        ),
      ][controller.currentIndex]),
    );
  }

  BottomNavigationBarItem _bottomNavigationBarItem(IconData activeIcon, String title){
    return BottomNavigationBarItem(
      icon: Icon(activeIcon), // Biểu tượng
      activeIcon: Icon(activeIcon), // Biểu tượng nổi bật
      label: title, // Tiêu đề. Màu nền chỉ có hiệu lực trong BottomNavigatinBar, không có hiệu lực trong thành phần kiểu iOS
    );
  }
}
