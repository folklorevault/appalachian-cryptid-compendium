"use client";

import { useState } from "react";
import { Link2, Check } from "lucide-react";

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.258 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 7.834 7.834 0 0 0-.567-.01c-.576 0-1.09.072-1.54.216-.449.143-.82.37-1.114.68-.293.31-.511.718-.653 1.223-.143.505-.214 1.118-.214 1.838v2.024h4.583l-.685 3.667h-3.898v7.98C18.265 22.981 24 17.309 24 10.044 24 2.179 17.866-3.57e-16 12 0S0 2.179 0 10.044c0 5.067 3.29 9.37 7.847 10.865.418.08.697.035.952-.045.378-.118.708-.396.95-.81.182-.312.322-.738.352-1.363z" />
  </svg>
);
import { Button } from "@/components/ui/button";
import { analytics } from "@/lib/analytics";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ShareButtonsProps {
  title: string;
  url?: string;
}

/**
 * Social share buttons for cryptid detail pages.
 * Includes Twitter/X, Facebook, and copy-to-clipboard.
 */
export const ShareButtons = ({ title, url }: ShareButtonsProps) => {
  const [copied, setCopied] = useState(false);

  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(`${title} - Appalachian Cryptid Compendium`);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      analytics.trackEvent("share", { platform: "copy", cryptid: title });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = shareUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = (platform: "twitter" | "facebook") => {
    analytics.trackEvent("share", { platform, cryptid: title });
    window.open(shareLinks[platform], "_blank", "width=600,height=400");
  };

  return (
    <TooltipProvider>
    <div className="flex items-center gap-1">
      <span className="text-xs uppercase tracking-widest text-muted-foreground font-typewriter mr-2">
        Share:
      </span>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleShare("twitter")}
          >
            <XIcon className="h-4 w-4" />
            <span className="sr-only">Share on Twitter</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Share on X/Twitter</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleShare("facebook")}
          >
            <FacebookIcon className="h-4 w-4" />
            <span className="sr-only">Share on Facebook</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Share on Facebook</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Link2 className="h-4 w-4" />
            )}
            <span className="sr-only">Copy link</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>{copied ? "Copied!" : "Copy link"}</TooltipContent>
      </Tooltip>
    </div>
    </TooltipProvider>
  );
};
