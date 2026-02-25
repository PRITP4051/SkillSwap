import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightLeft } from 'lucide-react';
import './Footer.css';
import xmlDataUrl from '../xml/footer.xml?url'; // Vite specific way to get raw URL for fetch

const Footer = () => {
    const [footerData, setFooterData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAndParseXML = async () => {
            try {
                const response = await fetch(xmlDataUrl);
                if (!response.ok) {
                    throw new Error('Failed to load XML data');
                }
                const xmlText = await response.text();

                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

                // Error handling for parser
                const parseError = xmlDoc.querySelector('parsererror');
                if (parseError) {
                    throw new Error('Error parsing XML data');
                }

                // Extract Data
                const company = xmlDoc.querySelector('company')?.textContent || '';
                const tagline = xmlDoc.querySelector('tagline')?.textContent || '';

                const linksNodes = xmlDoc.querySelectorAll('links link');
                const links = Array.from(linksNodes).map(node => ({
                    text: node.textContent,
                    url: node.getAttribute('url')
                }));

                const socialNodes = xmlDoc.querySelectorAll('social platform');
                const social = Array.from(socialNodes).map(node => ({
                    text: node.textContent,
                    url: node.getAttribute('url')
                }));

                const legalNodes = xmlDoc.querySelectorAll('legal item');
                const legal = Array.from(legalNodes).map(node => ({
                    text: node.textContent,
                    url: node.getAttribute('url')
                }));

                setFooterData({ company, tagline, links, social, legal });
            } catch (err) {
                console.error('Error fetching footer XML:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAndParseXML();
    }, []);

    if (loading) {
        return <footer className="footer"><div className="container" style={{ textAlign: 'center' }}>Loading footer...</div></footer>;
    }

    if (error || !footerData) {
        return <footer className="footer"><div className="container" style={{ textAlign: 'center', color: 'red' }}>Error loading footer data.</div></footer>;
    }

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-brand">
                        <h3><ArrowRightLeft size={24} /> {footerData.company}</h3>
                        <p>{footerData.tagline}</p>
                    </div>

                    <div className="footer-section">
                        <h4>Quick Links</h4>
                        <ul className="footer-links">
                            {footerData.links.map((link, index) => (
                                <li key={index}>
                                    <Link to={link.url} className="footer-link">{link.text}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4>Connect</h4>
                        <ul className="footer-links">
                            {footerData.social.map((platform, index) => (
                                <li key={index}>
                                    <a href={platform.url} target="_blank" rel="noopener noreferrer" className="footer-link">
                                        {platform.text}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <div className="footer-copyright">
                        &copy; {new Date().getFullYear()} {footerData.company}. All rights reserved.
                    </div>
                    <div className="footer-legal-links">
                        {footerData.legal.map((item, index) => (
                            <Link key={index} to={item.url}>{item.text}</Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
