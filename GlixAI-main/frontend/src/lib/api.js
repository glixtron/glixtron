import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const api = axios.create({
  baseURL: API,
  headers: { "Content-Type": "application/json" },
});

// Chat
export const sendMessage = (session_id, message, context = "") =>
  api.post("/chat", { session_id, message, context });

export const getChatSessions = () => api.get("/chat/sessions");

export const getChatHistory = (session_id) =>
  api.get(`/chat/history/${session_id}`);

export const deleteSession = (session_id) =>
  api.delete(`/chat/sessions/${session_id}`);

// Jobs
export const searchJobs = (query, location = "", skills = [], stream = "") =>
  api.post("/jobs/search", { query, location, skills, stream });

// Resume - FIX: use JSON body for text analysis
export const analyzeResume = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return api.post("/resume/analyze", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const analyzeResumeText = (text) =>
  api.post("/resume/analyze-text", { text });

// Roadmap
export const generateRoadmap = (current_skills, target_role, timeline_weeks = 12) =>
  api.post("/roadmap/generate", { current_skills, target_role, timeline_weeks });

// Skills
export const getSkillGapAnalysis = (current_skills, target_role) =>
  api.post("/skills/gap-analysis", { current_skills, target_role });

export const expandSkill = (term) =>
  api.post("/skills/expand", { term });

export const getAvailableRoles = () => api.get("/skills/roles");

// Analytics
export const getAutomationRisk = (job_title) =>
  api.post("/analytics/risk", { job_title });

export const getShadowSalary = (role) =>
  api.post("/analytics/salary", { role });

export const getFutureProofing = (role, skills) =>
  api.post("/analytics/future-proof", { role, skills });

// Sprints
export const generateSprint = (skill) =>
  api.post("/sprints/generate", { skill });

export const generateGapSprints = (missing_skills) =>
  api.post("/sprints/gap", { missing_skills });

// EQ/SQ
export const analyzeEQSQ = (text) =>
  api.post("/eq-sq/analyze", { text });

// Science Streams
export const getStreams = () => api.get("/streams");

export const matchStream = (stream, skills) =>
  api.post("/streams/match", { stream, skills });

// Passport
export const generatePassport = (name, skills, target_role, experience_level, bio) =>
  api.post("/passport/generate", { name, skills, target_role, experience_level, bio });

export const getPassport = (passport_id) =>
  api.get(`/passport/${passport_id}`);

// Brand
export const getBrandConfig = () => api.get("/brand");

export default api;
