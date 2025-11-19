/**
 * User-Agent Parser for ideaShell WebView Detection
 * Supports iOS and Android UA formats
 */

export interface UAInfo {
  /**
   * Whether this is an ideaShell WebView
   */
  isIdeaShell: boolean;

  /**
   * The detected platform
   */
  platform: 'ios' | 'android' | 'unknown';

  /**
   * IdeaShell app version (e.g., "2.5.8")
   */
  appVersion?: string;

  /**
   * IdeaShell build number (e.g., "258")
   */
  buildNumber?: string;

  /**
   * Device model
   * iOS: e.g., "iPhone13,2"
   * Android: e.g., "SM-G998B"
   */
  deviceModel?: string;

  /**
   * Network type (e.g., "WiFi", "4G", "5G")
   */
  netType?: string;

  /**
   * Language code (e.g., "zh_CN", "en_US")
   */
  language?: string;

  /**
   * Android ABI/Architecture (Android only)
   * e.g., "arm64", "x86"
   */
  abi?: string;

  /**
   * iOS version (iOS only)
   * e.g., "15.0"
   */
  iosVersion?: string;

  /**
   * Android version (Android only)
   * e.g., "13"
   */
  androidVersion?: string;

  /**
   * Chrome version (Android only)
   * e.g., "130.0.6723.58"
   */
  chromeVersion?: string;

  /**
   * Safari/WebKit version (iOS only)
   */
  safariVersion?: string;

  /**
   * Raw User-Agent string
   */
  rawUA: string;
}

export class UAParser {
  /**
   * Regular expressions for parsing different parts of the User-Agent
   */
  private static readonly PATTERNS = {
    // ideaShell pattern: ideaShell/{version}({build}) or ideaShellCN/{version}({build})
    ideaShell: /ideaShell(?:CN)?\/([0-9.]+)\((\d+)\)/,

    // iOS patterns
    iosVersion: /CPU (?:iPhone )?OS ([0-9_]+)/,
    iosDevice: /Device\/([^\s]+)/,
    safariVersion: /Version\/([0-9.]+)/,

    // Android patterns
    androidVersion: /Android ([0-9.]+)/,
    androidDevice: /Android [0-9.]+; ([^)]+)(?: Build|;|\))/,
    chromeVersion: /Chrome\/([0-9.]+)/,

    // Common patterns
    netType: /NetType\/([^\s]+)/,
    language: /Language\/([^\s]+)/,
    abi: /ABI\/([^\s]+)/,
  };

  /**
   * Parse a User-Agent string and extract information
   */
  public parse(ua: string): UAInfo {
    const info: UAInfo = {
      isIdeaShell: false,
      platform: 'unknown',
      rawUA: ua,
    };

    // Check if it's an ideaShell WebView
    const ideaShellMatch = ua.match(UAParser.PATTERNS.ideaShell);
    if (ideaShellMatch) {
      info.isIdeaShell = true;
      info.appVersion = ideaShellMatch[1];
      info.buildNumber = ideaShellMatch[2];
    }

    // Determine platform
    if (ua.includes('iPhone') || ua.includes('iPad') || ua.includes('iPod')) {
      info.platform = 'ios';
      this.parseIOS(ua, info);
    } else if (ua.includes('Android')) {
      info.platform = 'android';
      this.parseAndroid(ua, info);
    }

    // Parse common fields
    this.parseCommonFields(ua, info);

    return info;
  }

  /**
   * Parse iOS-specific fields
   */
  private parseIOS(ua: string, info: UAInfo): void {
    // iOS version
    const iosVersionMatch = ua.match(UAParser.PATTERNS.iosVersion);
    if (iosVersionMatch) {
      info.iosVersion = iosVersionMatch[1].replace(/_/g, '.');
    }

    // Device model (if using ideaShell format)
    const deviceMatch = ua.match(UAParser.PATTERNS.iosDevice);
    if (deviceMatch) {
      info.deviceModel = deviceMatch[1];
    }

    // Safari version
    const safariMatch = ua.match(UAParser.PATTERNS.safariVersion);
    if (safariMatch) {
      info.safariVersion = safariMatch[1];
    }
  }

  /**
   * Parse Android-specific fields
   */
  private parseAndroid(ua: string, info: UAInfo): void {
    // Android version
    const androidVersionMatch = ua.match(UAParser.PATTERNS.androidVersion);
    if (androidVersionMatch) {
      info.androidVersion = androidVersionMatch[1];
    }

    // Device model
    const deviceMatch = ua.match(UAParser.PATTERNS.androidDevice);
    if (deviceMatch) {
      info.deviceModel = deviceMatch[1].trim();
    }

    // Chrome version
    const chromeMatch = ua.match(UAParser.PATTERNS.chromeVersion);
    if (chromeMatch) {
      info.chromeVersion = chromeMatch[1];
    }

    // ABI/Architecture
    const abiMatch = ua.match(UAParser.PATTERNS.abi);
    if (abiMatch) {
      info.abi = abiMatch[1];
    }
  }

  /**
   * Parse common fields present in both iOS and Android
   */
  private parseCommonFields(ua: string, info: UAInfo): void {
    // Network type
    const netTypeMatch = ua.match(UAParser.PATTERNS.netType);
    if (netTypeMatch) {
      info.netType = netTypeMatch[1];
    }

    // Language
    const languageMatch = ua.match(UAParser.PATTERNS.language);
    if (languageMatch) {
      info.language = languageMatch[1];
    }
  }

  /**
   * Extract ideaShell version and build number
   * @returns Object with version and build, or null if not found
   */
  public extractIdeaShellVersion(ua: string): { version: string; build: string } | null {
    const match = ua.match(UAParser.PATTERNS.ideaShell);
    if (match) {
      return {
        version: match[1],
        build: match[2],
      };
    }
    return null;
  }

  /**
   * Quick check if the UA is from ideaShell WebView
   */
  public isWebView(ua: string): boolean {
    return UAParser.PATTERNS.ideaShell.test(ua);
  }

  /**
   * Check if the UA is from a mobile device
   */
  public isMobile(ua: string): boolean {
    return /Mobile|Android|iPhone|iPad|iPod/i.test(ua);
  }

  /**
   * Get platform from UA
   */
  public getPlatform(ua: string): 'ios' | 'android' | 'unknown' {
    if (/iPhone|iPad|iPod/i.test(ua)) {
      return 'ios';
    }
    if (/Android/i.test(ua)) {
      return 'android';
    }
    return 'unknown';
  }

  /**
   * Create a singleton instance for convenience
   */
  private static instance: UAParser;
  public static getInstance(): UAParser {
    if (!UAParser.instance) {
      UAParser.instance = new UAParser();
    }
    return UAParser.instance;
  }
}

/**
 * Convenience function to parse a User-Agent string
 */
export function parseUserAgent(ua: string): UAInfo {
  const parser = new UAParser();
  return parser.parse(ua);
}

/**
 * Convenience function to check if UA is ideaShell WebView
 */
export function isIdeaShellWebView(ua: string): boolean {
  const parser = new UAParser();
  return parser.isWebView(ua);
}

/**
 * Export default singleton instance
 */
export default UAParser.getInstance();