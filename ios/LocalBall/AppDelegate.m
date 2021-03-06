/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
#import "AppDelegate.h"
#import <Firebase.h>
#import <RNCPushNotificationIOS.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <React/RCTBridge.h>
#import <RNCPushNotificationIOS.h>
#import <RNGoogleSignin/RNGoogleSignin.h>
#import <FBSDKCoreKit/FBSDKCoreKit.h>

// #if DEBUG
//   #ifdef FB_SONARKIT_ENABLED
//   #import <FlipperKit/FlipperClient.h>
//   #import <FlipperKitLayoutPlugin/FlipperKitLayoutPlugin.h>
//   #import <FlipperKitLayoutPlugin/SKDescriptorMapper.h>
//   #import <FlipperKitNetworkPlugin/FlipperKitNetworkPlugin.h>
//   #import <FlipperKitReactPlugin/FlipperKitReactPlugin.h>
//   #import <FlipperKitUserDefaultsPlugin/FKUserDefaultsPlugin.h>
//   #import <SKIOSNetworkPlugin/SKIOSNetworkAdapter.h>
//   #endif
// #endif

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  // [self initializeFlipper:application];

  [FIRApp configure];
  
  [[FBSDKApplicationDelegate sharedInstance] application:application
                           didFinishLaunchingWithOptions:launchOptions];
                           
  NSURL *jsCodeLocation;

  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];

  [[UNUserNotificationCenter currentNotificationCenter] setDelegate:self];

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"LocalBall"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  return YES;
}

- (BOOL)application:(UIApplication *)application
          openURL:(nonnull NSURL *)url
          options:(nonnull NSDictionary<NSString *,id> *)options
  {
    return [[FBSDKApplicationDelegate sharedInstance]application:application
                                                                    openURL:url
                                                                    options:options]
              || [RNGoogleSignin application:application
                                                openURL:url
                                                options:options];
  }

// Initialize flipper integrations
// - (void) initializeFlipper:(UIApplication *)application {
//   #if DEBUG
//     #ifdef FB_SONARKIT_ENABLED
//       FlipperClient *client = [FlipperClient sharedClient];
//       SKDescriptorMapper *layoutDescriptorMapper = [[SKDescriptorMapper alloc] initWithDefaults];
//       [client addPlugin: [[FlipperKitLayoutPlugin alloc] initWithRootNode: application withDescriptorMapper: layoutDescriptorMapper]];
//       [client addPlugin: [[FKUserDefaultsPlugin alloc] initWithSuiteName:nil]];
//       [client addPlugin: [FlipperKitReactPlugin new]];
//       [client addPlugin: [[FlipperKitNetworkPlugin alloc] initWithNetworkAdapter:[SKIOSNetworkAdapter new]]];
//       [client start];
//     #endif
//   #endif
// }

// Registers user notifications
- (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings {
  [RNCPushNotificationIOS didRegisterUserNotificationSettings:notificationSettings];
}
// Registers remote notifications
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
  [RNCPushNotificationIOS didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}
// Handles local notifications
- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification {
  [RNCPushNotificationIOS didReceiveLocalNotification:notification];
}
// Handlers remote notifications
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(nonnull NSDictionary *)userInfo
                                                       fetchCompletionHandler:(nonnull void (^)(UIBackgroundFetchResult))completionHandler {
  [RNCPushNotificationIOS didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
}
// Handles the registrationError event.
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
{
  [RNCPushNotificationIOS didFailToRegisterForRemoteNotificationsWithError:error];
}
@end

