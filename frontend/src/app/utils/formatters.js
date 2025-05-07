import React from "react";
import {
  CheckCircle,
  Clock,
  CircleDashed,
  AlertCircle,
  ExternalLink,
  Shield,
  FileText,
} from "lucide-react";

// Format date helper
export const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      // hour: "2-digit",
      // minute: "2-digit",
    });
  } catch (e) {
    return "Invalid date";
  }
};

// Format remaining time for edit window with a more realistic timeframe
export const formatRemainingTime = (seconds) => {
  // Convert to minutes (with decimal point for more granular display)
  const totalMinutes = seconds / 60;

  // If we have less than 1 minute remaining
  if (totalMinutes < 1) {
    return `${seconds} seconds`;
  }

  // If we have less than 60 minutes (1 hour)
  if (totalMinutes < 60) {
    const minutes = Math.floor(totalMinutes);
    const remainingSeconds = seconds % 60;

    // If it's exactly a minute (no seconds), just show minutes
    if (remainingSeconds === 0) {
      return minutes === 1 ? "1 minute" : `${minutes} minutes`;
    }

    // Otherwise show minutes and seconds
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }

  // For hours display (when more than 60 minutes)
  const hours = Math.floor(totalMinutes / 60);
  const remainingMinutes = Math.floor(totalMinutes % 60);

  // If it's exactly on the hour
  if (remainingMinutes === 0) {
    return hours === 1 ? "1 hour" : `${hours} hours`;
  }

  // Otherwise show hours and minutes
  return `${hours}:${remainingMinutes.toString().padStart(2, "0")}`;
};

// Get status color class
export const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "completed":
      return "bg-green-900/30 text-green-400";
    case "in_progress":
      return "bg-blue-900/30 text-blue-400";
    case "pending":
      return "bg-yellow-900/30 text-yellow-400";
    case "failed":
      return "bg-red-900/30 text-red-400";
    default:
      return "bg-zinc-900/30 text-zinc-400";
  }
};

// Get severity color class
export const getSeverityColor = (severity) => {
  switch (severity?.toLowerCase()) {
    case "critical":
      return "bg-red-900/20 border-red-800/30 text-red-400";
    case "high":
      return "bg-orange-900/20 border-orange-800/30 text-orange-400";
    case "medium":
      return "bg-amber-900/20 border-amber-800/30 text-amber-400";
    case "low":
      return "bg-blue-900/20 border-blue-800/30 text-blue-400";
    case "info":
      return "bg-green-900/20 border-green-800/30 text-green-400";
    default:
      return "bg-zinc-900/20 border-zinc-800/30 text-zinc-400";
  }
};

// Get status icon
export const getStatusIcon = (status) => {
  switch (status?.toLowerCase()) {
    case "completed":
      return <CheckCircle size={16} className="text-green-400" />;
    case "in_progress":
      return <Clock size={16} className="text-blue-400" />;
    case "pending":
      return <CircleDashed size={16} className="text-yellow-400" />;
    case "failed":
      return <AlertCircle size={16} className="text-red-400" />;
    default:
      return <CircleDashed size={16} className="text-zinc-400" />;
  }
};

// Get upload type icon
export const getUploadTypeIcon = (type) => {
  switch (type?.toLowerCase()) {
    case "github":
      return <ExternalLink size={16} className="text-zinc-400" />;
    case "program_id":
      return <Shield size={16} className="text-zinc-400" />;
    case "google_drive":
      return <FileText size={16} className="text-zinc-400" />;
    case "gitlab":
      return <ExternalLink size={16} className="text-zinc-400" />;
    case "bitbucket":
      return <ExternalLink size={16} className="text-zinc-400" />;
    case "ipfs":
      return <ExternalLink size={16} className="text-zinc-400" />;
    default:
      return <FileText size={16} className="text-zinc-400" />;
  }
};
