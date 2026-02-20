import lzString from "lz-string";

export function compress(code: string): string {
	return lzString.compressToEncodedURIComponent(code);
}

export function decompress(compressed: string): string | null {
	return lzString.decompressFromEncodedURIComponent(compressed);
}
