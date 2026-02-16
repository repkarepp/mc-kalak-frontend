export function getImageUrl(path: string): string {
  if (!path) return "";

  // Jika path sudah full URL, return as is
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // Jika path relatif (uploads/xxx.png), tambahkan base URL
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
  // Remove /api suffix if exists
  const cleanBaseUrl = baseUrl.replace(/\/api$/, "");
  return `${cleanBaseUrl}/${path}`;
}

export function getAvatarUrl(avatarPath: string, username?: string): string {
  if (avatarPath) {
    return getImageUrl(avatarPath);
  }

  // Return default avatar atau initial based avatar
  if (username) {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random&color=fff`;
  }

  return "https://ui-avatars.com/api/?name=User&background=random&color=fff";
}
