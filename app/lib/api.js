const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";


// ============================================
// REQUEST
// ============================================

async function request(endpoint, options = {}) {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("admin_token")
      : null;

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,

      headers: {
        "Content-Type": "application/json",

        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),

        ...(options.headers || {}),
      },
    }
  );

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




// ============================================
// PORTFOLIO
// ============================================

export async function getPortfolio() {
  const response = await fetch(`${API_BASE_URL}/portfolio`, {
    next: {
      revalidate: 60,
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
        "Failed to load portfolio data."
    );
  }

  return data;
}


export async function getProfile() {
  const response =
    await getPortfolio();

  return {
    success: response.success,
    data: response.data?.profile || null,
  };
}


export async function getServices() {
  const response =
    await getPortfolio();

  return {
    success: response.success,
    data: response.data?.services || [],
  };
}


export async function getSkills() {
  const response =
    await getPortfolio();

  return {
    success: response.success,
    data: response.data?.skills || [],
  };
}


export async function getProjects() {
  const response =
    await getPortfolio();

  return {
    success: response.success,
    data: response.data?.projects || [],
  };
}



export async function getStats() {
  const response =
    await getPortfolio();

  return {
    success: response.success,
    data: response.data?.stats || {},
  };
}


// ============================================
// CONTACT / ENQUIRY
// ============================================

export async function createEnquiry(data) {
  return request(
    "/enquiries",
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

export async function adminLogin(email, password) {
  const response = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (response.success && response.data?.token) {
    localStorage.setItem(
      "admin_token",
      response.data.token
    );

    localStorage.setItem(
      "admin_user",
      JSON.stringify(response.data.user)
    );
  }

  return response;
}

export async function getDashboard() {
  return request("/dashboard");
}



// ============================================
// ADMIN AUTH
// ============================================



// ============================================
// ADMIN DASHBOARD
// ============================================



// ============================================
// ADMIN — ENQUIRIES
// ============================================

// ============================================
// ENQUIRIES — ADMIN
// ============================================

// ============================================
// ENQUIRIES — ADMIN
// ============================================

export async function getEnquiries() {
  return request("/enquiries");
}

export async function getEnquiryById(id) {
  return request(`/enquiries/${id}`);
}

export async function updateEnquiryStatus(id, status) {
  return request(`/enquiries/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({
      status,
    }),
  });
}

export async function deleteEnquiry(id) {
  return request(`/enquiries/${id}`, {
    method: "DELETE",
  });
}


// ============================================
// CLIENTS — ADMIN
// ============================================



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
  return request(`/clients/${id}`, {
    method: "DELETE",
  });
}

// ============================================
// PROPOSALS — ADMIN
// ============================================


export async function getProposals(token) {
  return request("/proposals", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}


export async function getProposalById(
  id,
  token
) {
  return request(`/proposals/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}


export async function createProposal(
  data,
  token
) {
  return request("/proposals", {
    method: "POST",

    headers: {
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify(data),
  });
}


export async function updateProposal(
  id,
  data,
  token
) {
  return request(`/proposals/${id}`, {
    method: "PUT",

    headers: {
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify(data),
  });
}


export async function updateProposalStatus(
  id,
  status,
  token
) {
  return request(`/proposals/${id}/status`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      status,
    }),
  });
}


export async function deleteProposal(
  id,
  token
) {
  return request(`/proposals/${id}`, {
    method: "DELETE",

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// ============================================
// PROJECTS — ADMIN
// ============================================

export async function getProjectsAdmin(token) {
  return request("/projects", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}


export async function getProjectById(
  id,
  token
) {
  return request(`/projects/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}


export async function createProject(
  data,
  token
) {
  return request("/projects", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
}


export async function updateProject(
  id,
  data,
  token
) {
  return request(`/projects/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
}


export async function updateProjectStatus(
  id,
  status,
  token
) {
  return request(
    `/projects/${id}/status`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        status,
      }),
    }
  );
}


export async function deleteProject(
  id,
  token
) {
  return request(`/projects/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// ============================================
// PROPOSALS — ADMIN
// ============================================
// ============================================
// CLIENTS — ADMIN
// ============================================

export async function getClients(token) {
  return request("/clients", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}


// ============================================
// PROPOSALS — ADMIN
// ============================================

export async function getProposalsAdmin(token) {
  return request("/proposals", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// ============================================
// REVIEWS — ADMIN
// ============================================

export async function getReviews(token) {
  return request("/reviews", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}


export async function getReviewById(
  id,
  token
) {
  return request(`/reviews/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}


export async function createReview(
  data,
  token
) {
  return request("/reviews", {
    method: "POST",

    headers: {
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify(data),
  });
}


export async function updateReview(
  id,
  data,
  token
) {
  return request(`/reviews/${id}`, {
    method: "PUT",

    headers: {
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify(data),
  });
}


export async function updateReviewApproval(
  id,
  isApproved,
  token
) {
  return request(
    `/reviews/${id}/approval`,
    {
      method: "PATCH",

      headers: {
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        isApproved,
      }),
    }
  );
}


export async function updateReviewPublishStatus(
  id,
  isPublished,
  token
) {
  return request(
    `/reviews/${id}/publish`,
    {
      method: "PATCH",

      headers: {
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        isPublished,
      }),
    }
  );
}


export async function deleteReview(
  id,
  token
) {
  return request(`/reviews/${id}`, {
    method: "DELETE",

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
// ============================================
// GENERIC
// ============================================

export { request };