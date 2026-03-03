const extractMessage = (data) => {
  if (!data) return null;

  if (typeof data === "string") {
    return data.trim();
  }

  if (Array.isArray(data)) {
    const texts = data.filter((item) => typeof item === "string");
    if (texts.length) {
      return texts.join(" ");
    }
  }

  if (typeof data === "object") {
    if (typeof data.message === "string") return data.message.trim();
    if (typeof data.error === "string") return data.error.trim();
    if (Array.isArray(data.errors)) {
      const messages = data.errors
        .map((entry) => {
          if (typeof entry === "string") return entry.trim();
          if (entry && typeof entry.message === "string") {
            return entry.message.trim();
          }
          return null;
        })
        .filter(Boolean);
      if (messages.length) {
        return messages.join(" ");
      }
    }
  }

  return null;
};

const isFriendlyMessage = (message) => {
  if (!message) return false;
  if (message.length > 200) return false;
  if (message.includes("\n")) return false;
  if (/exception|stack|java|org\./i.test(message)) return false;
  return true;
};

export const formatApiError = (error, { action = "submit your request" } = {}) => {
  const status = error?.response?.status;
  const rawMessage = extractMessage(error?.response?.data);
  const friendlyMessage = isFriendlyMessage(rawMessage) ? rawMessage : null;
  const timestamp = new Date().toISOString();
  const requestId =
    error?.response?.headers?.["x-request-id"] ||
    error?.response?.headers?.["x-correlation-id"];

  const supportLines = [
    `Timestamp: ${timestamp}`,
    status ? `Status: ${status}` : null,
    error?.config?.method
      ? `Method: ${String(error.config.method).toUpperCase()}`
      : null,
    error?.config?.url ? `Endpoint: ${error.config.url}` : null,
    requestId ? `Request ID: ${requestId}` : null,
  ].filter(Boolean);

  if (status === 400) {
    if (friendlyMessage) {
      return `We couldn't ${action}. ${friendlyMessage}`;
    }
    return `We couldn't ${action}. Please check required fields and number formats, then try again.`;
  }

  if (!status) {
    return (
      `We couldn't reach the server. Please check your connection and try again.` +
      `\n\nIf this keeps happening, contact the owners with:\n${supportLines.join(
        "\n"
      )}`
    );
  }

  if (status >= 500) {
    return (
      `Something went wrong on our side. Please try again later.` +
      `\n\nIf this keeps happening, contact the owners with:\n${supportLines.join(
        "\n"
      )}`
    );
  }

  if (friendlyMessage) {
    return `We couldn't ${action}. ${friendlyMessage}`;
  }

  return `We couldn't ${action}. Please review your inputs and try again.`;
};

