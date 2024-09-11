export const sanitizeHtml = (html: string): string => {
	// Remove script and style tags
	const strippedHtml = html.replace(
		/<(script|style)([\S\s]*?)>([\S\s]*?)<\/(script|style)>/gims,
		''
	);

	// Remove event attributes and JavaScript: URLs
	const sanitizedHtml = strippedHtml.replace(
		/<([^>]+?)\s*([^>]*?)(on\w+\s*=\s*["']?[^"']*?|javascript\s*:\s*[^"']*)\s*([^>]*?)>/gim,
		'<$1$2$4>'
	);

	return sanitizedHtml;
};
