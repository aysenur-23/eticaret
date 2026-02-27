'use client'

import React from 'react'

export function StructuredData() {
    const organizationData = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Batarya Kit",
        "url": "https://bataryakit.com",
        "logo": "https://bataryakit.com/logo.png",
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+90-534-328-83-83",
            "contactType": "customer service",
            "areaServed": "TR",
            "availableLanguage": "Turkish"
        },
        "sameAs": [
            "https://facebook.com/bataryakit",
            "https://twitter.com/bataryakit",
            "https://instagram.com/bataryakit"
        ]
    }

    const websiteData = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Batarya Kit",
        "url": "https://bataryakit.com",
        "potentialAction": {
            "@type": "SearchAction",
            "target": "https://bataryakit.com/products?q={search_term_string}",
            "query-input": "required name=search_term_string"
        }
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
            />
        </>
    )
}
