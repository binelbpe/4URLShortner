const Url = require('../models/Url');
const useragent = require('express-useragent');

exports.redirectUrl = async (req, res, next) => {
    try {
        const { code } = req.params;
        const url = await Url.findOne({ urlCode: code });

        if (!url) {
            return res.status(404).json({ message: 'URL not found' });
        }
 
        const userAgentString = req.headers['user-agent'];
        const userAgent = useragent.parse(userAgentString);
        const ua = userAgentString.toLowerCase();
        const secChUa = req.headers['sec-ch-ua'] || '';
  
        let browser = 'Other';
        if (secChUa.includes('Brave')) {
            browser = 'Brave';
        } else if (ua.includes('firefox')) {
            browser = 'Firefox';
        } else if (ua.includes('edge') || ua.includes('edg/')) {
            browser = 'Edge';
        } else if (ua.includes('chrome')) {
            browser = 'Chrome';
        } else if (ua.includes('safari')) {
            browser = 'Safari';
        }

        let ip = req.headers['x-forwarded-for'] || 
                req.headers['x-real-ip'] ||
                req.ip || 
                req.connection.remoteAddress;

        if (ip) {
            ip = ip.split(',')[0].trim();
            if (ip.includes('::ffff:')) {
                ip = ip.replace('::ffff:', '');
            }
        }

        let os = 'Unknown';
        if (ua.includes('windows')) {
            if (ua.includes('windows nt 10.0')) {
                os = 'Windows 11/10';
            } else if (ua.includes('windows nt 6.3')) {
                os = 'Windows 8.1';
            } else if (ua.includes('windows nt 6.2')) {
                os = 'Windows 8';
            } else if (ua.includes('windows nt 6.1')) {
                os = 'Windows 7';
            } else if (ua.includes('windows phone')) {
                os = 'Windows Phone';
            } else {
                os = 'Windows (Other)';
            }
        } else if (ua.includes('mac os x')) {
            if (ua.includes('iphone')) {
                os = 'iOS (iPhone)';
            } else if (ua.includes('ipad')) {
                os = 'iOS (iPad)';
            } else {
                os = 'macOS';
            }
        } else if (ua.includes('android')) {
            if (ua.includes('mobile')) {
                os = 'Android Mobile';
            } else {
                os = 'Android Tablet';
            }
        } else if (ua.includes('linux')) {
            if (ua.includes('ubuntu')) {
                os = 'Ubuntu';
            } else if (ua.includes('fedora')) {
                os = 'Fedora';
            } else if (ua.includes('debian')) {
                os = 'Debian';
            } else {
                os = 'Linux';
            }
        } else if (ua.includes('cros')) {
            os = 'Chrome OS';
        }

        // Detailed device detection
        let device = 'Desktop';
        if (userAgent.isMobile) {
            if (ua.includes('iphone')) {
                device = 'iPhone';
            } else if (ua.includes('ipad')) {
                device = 'iPad';
            } else if (ua.includes('android')) {
                if (ua.includes('mobile')) {
                    device = 'Android Phone';
                } else {
                    device = 'Android Tablet';
                }
            } else {
                device = 'Mobile';
            }
        } else if (userAgent.isTablet) {
            if (ua.includes('ipad')) {
                device = 'iPad';
            } else if (ua.includes('android')) {
                device = 'Android Tablet';
            } else {
                device = 'Tablet';
            }
        }

        const clickDetail = {
            timestamp: new Date(),
            userAgent: userAgentString,
            ipAddress: ip,
            referer: req.headers.referer || '',
            device: device,
            browser: browser,
            os: os
        };
       
        url.clicks += 1;
        url.clickDetails.push(clickDetail);
        await url.save();
        
        return res.redirect(url.originalUrl);
    } catch (error) {
        console.error('Error in redirect:', error);
        next(error);
    }
};
