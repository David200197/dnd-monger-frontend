// src/hooks/useImage.ts
import { useState, useEffect, useRef } from "react";

interface UseImageOptions {
  crossOrigin?: "anonymous" | "use-credentials" | "";
  onLoad?: (image: HTMLImageElement) => void;
  onError?: (error: Error) => void;
}

interface UseImageResult {
  image: HTMLImageElement | null;
  status: "loading" | "loaded" | "error";
  error: Error | null;
}

export const useImage = (
  src: string | undefined,
  options: UseImageOptions = {}
): UseImageResult => {
  const { crossOrigin = "anonymous", onLoad, onError } = options;

  const [state, setState] = useState<UseImageResult>({
    image: null,
    status: "loading",
    error: null,
  });

  const mountedRef = useRef(true);
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      // Cleanup: revoke object URL if it was created
      if (imageRef.current && src?.startsWith("blob:")) {
        URL.revokeObjectURL(src);
      }
    };
  }, []);

  useEffect(() => {
    if (!src) {
      setState({
        image: null,
        status: "loading",
        error: null,
      });
      return;
    }

    // Reset state when src changes
    setState({
      image: null,
      status: "loading",
      error: null,
    });

    const image = new Image();
    imageRef.current = image;

    // Handle image load
    const handleLoad = () => {
      if (!mountedRef.current) return;

      setState({
        image,
        status: "loaded",
        error: null,
      });

      onLoad?.(image);
    };

    // Handle image error
    const handleError = (error: ErrorEvent) => {
      if (!mountedRef.current) return;

      const errorObj = new Error(`Failed to load image: ${src}`);

      setState({
        image: null,
        status: "error",
        error: errorObj,
      });

      onError?.(errorObj);
    };

    // Set up event listeners
    image.addEventListener("load", handleLoad);
    image.addEventListener("error", handleError);

    // Start loading the image
    if (crossOrigin) {
      image.crossOrigin = crossOrigin;
    }
    image.src = src;

    // If image is already cached/completed, trigger load manually
    if (image.complete) {
      handleLoad();
    }

    // Cleanup function
    return () => {
      image.removeEventListener("load", handleLoad);
      image.removeEventListener("error", handleError);

      // Don't revoke object URL here as it might be used by multiple components
      // Object URL revocation should be handled by the component that created it
    };
  }, [src, crossOrigin, onLoad, onError]);

  return state;
};

// Versión simplificada para uso común
export const useImageSimple = (
  src: string | undefined
): HTMLImageElement | null => {
  const { image } = useImage(src);
  return image;
};
