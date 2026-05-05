"use client";

import React from "react";

/**
 * A lightweight component to render text containing simple HTML tags
 * like <b>, <i>, and <p align="center">.
 */
export default function FormattedText({
  text,
  className = "",
}: {
  text?: string;
  className?: string;
}) {
  if (!text) return null;

  // Since we want to support alignment tags like <p align="center">,
  // we use dangerouslySetInnerHTML. In a production app, you might
  // want to use a sanitizer library, but for this CMS it's standard practice.
  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: text }}
    />
  );
}
