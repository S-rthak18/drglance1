// API utility functions for authenticated requests

/**
 * Make authenticated API calls with Clerk token
 * Usage: const data = await authenticatedFetch('/api/scans', { method: 'GET' })
 */
export async function authenticatedFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  try {
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Fetch error:", error)
    throw error
  }
}

/**
 * Get current user from Clerk
 */
export async function getCurrentUser() {
  try {
    const response = await fetch("/api/user")
    if (!response.ok) throw new Error("Failed to fetch user")
    return await response.json()
  } catch (error) {
    console.error("Error fetching user:", error)
    return null
  }
}

/**
 * Upload health scan image
 */
export async function uploadHealthScan(
  imageFile: File,
  scanType: "oral" | "eye"
) {
  const formData = new FormData()
  formData.append("image", imageFile)
  formData.append("scanType", scanType)

  try {
    const response = await fetch("/api/scans/upload", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) throw new Error("Upload failed")
    return await response.json()
  } catch (error) {
    console.error("Upload error:", error)
    throw error
  }
}

/**
 * Get user's health scans
 */
export async function getUserScans(limit: number = 10) {
  return authenticatedFetch(`/api/scans?limit=${limit}`)
}

/**
 * Get specific scan result
 */
export async function getScanResult(scanId: string) {
  return authenticatedFetch(`/api/scans/${scanId}`)
}

/**
 * Delete a scan
 */
export async function deleteScan(scanId: string) {
  return authenticatedFetch(`/api/scans/${scanId}`, { method: "DELETE" })
}

/**
 * Update user profile
 */
export async function updateUserProfile(userData: Record<string, any>) {
  return authenticatedFetch("/api/user/profile", {
    method: "PUT",
    body: JSON.stringify(userData),
  })
}

/**
 * Get user preferences/settings
 */
export async function getUserSettings() {
  return authenticatedFetch("/api/user/settings")
}

/**
 * Update user settings
 */
export async function updateUserSettings(settings: Record<string, any>) {
  return authenticatedFetch("/api/user/settings", {
    method: "PUT",
    body: JSON.stringify(settings),
  })
}

/**
 * Get health analytics
 */
export async function getHealthAnalytics() {
  return authenticatedFetch("/api/analytics")
}

/**
 * Generate health report
 */
export async function generateHealthReport(format: "pdf" | "json" = "pdf") {
  return authenticatedFetch(`/api/reports/generate?format=${format}`, {
    method: "POST",
  })
}

/**
 * Send consultation request
 */
export async function requestConsultation(specialistType: string, notes?: string) {
  return authenticatedFetch("/api/consultation/request", {
    method: "POST",
    body: JSON.stringify({
      specialistType,
      notes,
    }),
  })
}

/**
 * Get consultation history
 */
export async function getConsultationHistory() {
  return authenticatedFetch("/api/consultation/history")
}
