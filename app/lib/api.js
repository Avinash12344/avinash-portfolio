const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

/* ============================================
   REQUEST
   ============================================ */

async function request(endpoint, options = {}) {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("admin_token")
      : null;

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
        "Something went wrong with the API request."
    );
  }

  return data;
}

/* ============================================
   PORTFOLIO — PUBLIC
   ============================================ */

export async function getPortfolio() {
  const response = await fetch(`${API_BASE_URL}/portfolio`, {
    next: { revalidate: 60 },
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(
      data?.message || "Failed to load portfolio data."
    );
  }

  return data;
}

export async function getProfile() {
  const response = await getPortfolio();
  return { success: response.success, data: response.data?.profile || null };
}

export async function getServices() {
  const response = await getPortfolio();
  return { success: response.success, data: response.data?.services || [] };
}

export async function getSkills() {
  const response = await getPortfolio();
  return { success: response.success, data: response.data?.skills || [] };
}

export async function getProjects() {
  const response = await getPortfolio();
  return { success: response.success, data: response.data?.projects || [] };
}

export async function getStats() {
  const response = await getPortfolio();
  return { success: response.success, data: response.data?.stats || {} };
}

/* ============================================
   AUTH
   ============================================ */

export async function adminLogin(email, password) {
  const response = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (response.success && response.data?.token) {
    localStorage.setItem("admin_token", response.data.token);
    localStorage.setItem(
      "admin_user",
      JSON.stringify(response.data.user)
    );
  }

  return response;
}

/* ============================================
   DASHBOARD
   ============================================ */

export async function getDashboard() {
  return request("/dashboard");
}

/* ============================================
   ENQUIRIES — PUBLIC + ADMIN
   ============================================ */

export async function createEnquiry(data) {
  return request("/enquiries", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getEnquiries() {
  return request("/enquiries");
}

export async function getEnquiryById(id) {
  return request(`/enquiries/${id}`);
}

export async function updateEnquiryStatus(id, status) {
  return request(`/enquiries/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function deleteEnquiry(id) {
  return request(`/enquiries/${id}`, { method: "DELETE" });
}
/* ============================================
   CLIENTS — ADMIN
   ============================================ */

export async function getClients() {
  return request("/clients");
}

export async function getClientById(id) {
  return request(`/clients/${id}`);
}

export async function updateClient(id, data) {
  return request(`/clients/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteClient(id) {
  return request(`/clients/${id}`, { method: "DELETE" });
}

/* ============================================
   PROPOSALS — ADMIN
   ============================================ */

export async function getProposals() {
  return request("/proposals");
}

export async function getProposalById(id) {
  return request(`/proposals/${id}`);
}

export async function createProposal(data) {
  return request("/proposals", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateProposal(id, data) {
  return request(`/proposals/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function updateProposalStatus(id, status) {
  return request(`/proposals/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function deleteProposal(id) {
  return request(`/proposals/${id}`, { method: "DELETE" });
}

export async function getProposalsAdmin() {
  return request("/proposals");
}

/* ============================================
   PROJECTS — ADMIN
   ============================================ */

export async function getProjectsAdmin() {
  return request("/projects");
}

export async function getProjectById(id) {
  return request(`/projects/${id}`);
}

export async function createProject(data) {
  return request("/projects", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateProject(id, data) {
  return request(`/projects/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function updateProjectStatus(id, status) {
  return request(`/projects/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function deleteProject(id) {
  return request(`/projects/${id}`, { method: "DELETE" });
}

/* ============================================
   REVIEWS — ADMIN
   ============================================ */

export async function getReviews() {
  return request("/reviews/admin");
}

export async function getReviewById(id) {
  return request(`/reviews/${id}`);
}

export async function createReview(data) {
  return request("/reviews", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateReview(id, data) {
  return request(`/reviews/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function updateReviewApproval(id, isApproved) {
  return request(`/reviews/${id}/approval`, {
    method: "PATCH",
    body: JSON.stringify({ isApproved }),
  });
}

export async function updateReviewPublishStatus(id, isPublished) {
  return request(`/reviews/${id}/publish`, {
    method: "PATCH",
    body: JSON.stringify({ isPublished }),
  });
}

export async function deleteReview(id) {
  return request(`/reviews/${id}`, { method: "DELETE" });
}
/* ============================================
   SERVICES — ADMIN
   ============================================ */

export async function getAdminServices() {
  return request("/admin/portfolio/services");
}

export async function createService(data) {
  return request("/admin/portfolio/services", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateService(id, data) {
  return request(`/admin/portfolio/services/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteService(id) {
  return request(`/admin/portfolio/services/${id}`, {
    method: "DELETE",
  });
}

/* ============================================
   SKILLS — ADMIN
   ============================================ */

export async function getAdminSkills() {
  return request("/admin/portfolio/skills");
}

export async function createSkill(data) {
  return request("/admin/portfolio/skills", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateSkill(id, data) {
  return request(`/admin/portfolio/skills/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteSkill(id) {
  return request(`/admin/portfolio/skills/${id}`, {
    method: "DELETE",
  });
}

/* ============================================
   PROFILE — ADMIN
   ============================================ */

export async function getAdminProfile() {
  return request("/admin/portfolio/profile");
}

export async function updateAdminProfile(data) {
  return request("/admin/portfolio/profile", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/* ============================================
   WORK — PUBLIC (merged client + portfolio)
   ============================================ */

export async function getWork() {
  const response = await fetch(`${API_BASE_URL}/work`, {
    next: { revalidate: 60 },
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.message || "Failed to load work.");
  }

  return data;
}

export async function getWorkBySlug(slug) {
  const response = await fetch(`${API_BASE_URL}/work/${slug}`, {
    next: { revalidate: 60 },
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.message || "Failed to load project.");
  }

  return data;
}

/* ============================================
   MY WORK — ADMIN
   ============================================ */

export async function getMyWork() {
  return request("/admin/my-work");
}

export async function getMyWorkById(id) {
  return request(`/admin/my-work/${id}`);
}

export async function createMyWork(data) {
  return request("/admin/my-work", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateMyWork(id, data) {
  return request(`/admin/my-work/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteMyWork(id) {
  return request(`/admin/my-work/${id}`, { method: "DELETE" });
}

export async function addMyWorkImage(projectId, data) {
  return request(`/admin/my-work/${projectId}/images`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateMyWorkImage(projectId, imageId, data) {
  return request(`/admin/my-work/${projectId}/images/${imageId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteMyWorkImage(projectId, imageId) {
  return request(`/admin/my-work/${projectId}/images/${imageId}`, {
    method: "DELETE",
  });
}

/* ============================================
   GENERIC
   ============================================ */

export { request };