package studio.brittle.lenscourage

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray
import java.io.File

class DevDataModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName() = "LensCourageDevData"

  @ReactMethod
  fun deleteLocalRecordings(paths: ReadableArray, promise: Promise) {
    try {
      val allowedRoots =
        listOf(reactApplicationContext.filesDir, reactApplicationContext.cacheDir)
          .map { it.canonicalFile }
      var deleted = 0
      for (index in 0 until paths.size()) {
        val rawPath = paths.getString(index) ?: continue
        val file = File(rawPath.removePrefix("file://")).canonicalFile
        val isAppPrivate =
          allowedRoots.any { root ->
            file.path == root.path || file.path.startsWith(root.path + File.separator)
          }
        if (isAppPrivate && file.isFile && file.delete()) deleted += 1
      }
      promise.resolve(deleted)
    } catch (error: Exception) {
      promise.reject("delete-recordings-failed", error)
    }
  }
}
