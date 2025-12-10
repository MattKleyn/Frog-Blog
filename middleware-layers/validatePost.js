import {getCategoriesByIds} from "../data-access-layers/data_access.js";

export function attachUserToLocals(req, res, next) {
    console.log("attachUserToLocals:", req.user);
    res.locals.user = req.user || null; 
    next();
}

export function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login_form");
}

// Helpers
const isString = (v) => typeof v === "string";
const safeTrim = (v) => (isString(v) ? v.trim() : "");
const normalizeCategories = (cat) => {
  if (!cat) return [];
  return Array.isArray(cat) ? cat : [cat];
};
const maxLen = (str, n) => str.length <= n;

export async function validatePostInput(data, categoriesFromDb) {
  const errors = [];

  // Basic field normalization
  const normalized = {
    title: safeTrim(data.title),
    body: safeTrim(data.body),
    author: safeTrim(data.author),
    categories: normalizeCategories(data.category),
  };

  // Required checks
  if (!normalized.title) errors.push("Title is required.");
  if (!normalized.body) errors.push("Body is required.");
  if (!normalized.author) errors.push("Author is required.");

  // Length checks
  if (!maxLen(normalized.title, 150)) errors.push("Title must be 150 characters or fewer.");
  if (!maxLen(normalized.author, 100)) errors.push("Author must be 100 characters or fewer.");
  if (!maxLen(normalized.body, 20000)) errors.push("Body is too long.");

  // Category existence check
  const validIds = categoriesFromDb.map(c => c.category_id);
  const invalid = normalized.categories.filter(id => !validIds.includes(id));
  if (invalid.length) errors.push("One or more selected categories do not exist.");

  return { errors, normalized };
};