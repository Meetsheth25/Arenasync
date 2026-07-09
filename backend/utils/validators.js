// ================= COMPREHENSIVE VALIDATION UTILITIES =================

// Email validation
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return "Email is required";
  if (email.length > 100) return "Email must be less than 100 characters";
  if (!emailRegex.test(email)) return "Please enter a valid email address";
  return null;
};

// Password validation (strong password)
const validatePassword = (password) => {
  if (!password) return "Password is required";
  if (password.length < 6) return "Password must be at least 6 characters";
  if (password.length > 50) return "Password must be less than 50 characters";
  if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter";
  if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter";
  if (!/[0-9]/.test(password)) return "Password must contain at least one number";
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return "Password must contain at least one special character";
  if (/\s/.test(password)) return "Password cannot contain spaces";
  return null;
};

// Name validation
const validateName = (name) => {
  if (!name) return "Name is required";
  if (name.length < 3) return "Name must be at least 3 characters";
  if (name.length > 50) return "Name must be less than 50 characters";
  if (!/^[a-zA-Z\s]+$/.test(name)) return "Name can only contain letters and spaces";
  if (name.trim() !== name) return "Name cannot start or end with spaces";
  return null;
};

// Phone validation
const validatePhone = (phone) => {
  if (!phone) return null; // Optional
  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(phone)) return "Phone number must be 10 digits";
  return null;
};

// Team name validation
const validateTeamName = (name) => {
  if (!name) return "Team name is required";
  if (name.length < 3) return "Team name must be at least 3 characters";
  if (name.length > 50) return "Team name must be less than 50 characters";
  if (!/^[a-zA-Z0-9\s]+$/.test(name)) return "Team name can only contain letters, numbers and spaces";
  if (name.trim() !== name) return "Team name cannot start or end with spaces";
  return null;
};

// Tournament name validation
const validateTournamentName = (name) => {
  if (!name) return "Tournament name is required";
  if (name.length < 3) return "Tournament name must be at least 3 characters";
  if (name.length > 100) return "Tournament name must be less than 100 characters";
  return null;
};

// Date validation
const validateDates = (startDate, endDate) => {
  if (!startDate) return "Start date is required";
  if (!endDate) return "End date is required";
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (isNaN(start.getTime())) return "Invalid start date";
  if (isNaN(end.getTime())) return "Invalid end date";
  if (start < today) return "Start date cannot be in the past";
  if (end <= start) return "End date must be after start date";
  
  const maxDuration = 365; // 1 year max
  const durationDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  if (durationDays > maxDuration) return `Tournament duration cannot exceed ${maxDuration} days`;
  
  return null;
};

// Number validation
const validateNumber = (value, fieldName, min = 1, max = 1000) => {
  if (!value) return null;
  const num = Number(value);
  if (isNaN(num)) return `${fieldName} must be a number`;
  if (num < min) return `${fieldName} must be at least ${min}`;
  if (num > max) return `${fieldName} must be less than ${max}`;
  return null;
};

// Description validation
const validateDescription = (description) => {
  if (!description) return null;
  if (description.length < 10) return "Description must be at least 10 characters";
  if (description.length > 2000) return "Description must be less than 2000 characters";
  return null;
};

// Rules validation
const validateRules = (rules) => {
  if (!rules) return null;
  if (rules.length < 10) return "Rules must be at least 10 characters";
  if (rules.length > 5000) return "Rules must be less than 5000 characters";
  return null;
};

// Tournament validation (complete)
const validateTournament = (data) => {
  const errors = {};
  
  const nameError = validateTournamentName(data.eventName);
  if (nameError) errors.eventName = nameError;
  
  if (!data.sportId) errors.sportId = "Sport is required";
  if (!data.venueId) errors.venueId = "Venue is required";
  
  const dateError = validateDates(data.startDate, data.endDate);
  if (dateError) errors.dates = dateError;
  
  const maxParticipantsError = validateNumber(data.maxParticipants, "Max participants", 2, 100);
  if (maxParticipantsError) errors.maxParticipants = maxParticipantsError;
  
  const descriptionError = validateDescription(data.description);
  if (descriptionError) errors.description = descriptionError;
  
  const rulesError = validateRules(data.rules);
  if (rulesError) errors.rules = rulesError;
  
  return errors;
};

module.exports = {
  validateEmail,
  validatePassword,
  validateName,
  validatePhone,
  validateTeamName,
  validateTournamentName,
  validateDates,
  validateNumber,
  validateDescription,
  validateRules,
  validateTournament
};