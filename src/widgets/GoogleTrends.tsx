import React from "react";
import ReactDOM from "react-dom";
import Script from "react-load-script";

export default function GoogleTrends({ type, keyword, url }) {
    const handleScriptLoad = _ => {
        (window as any).trends.embed.renderExploreWidgetTo(
            document.getElementById("widget"),
            type,
            {
                comparisonItem: [{ keyword, time: "today 12-m" }],
                category: 0,
                property: ""
            },
            {
                exploreQuery: `q=${encodeURI(keyword)}&geo=US&date=today 12-m`,
                guestPath: "https://trends.google.com:443/trends/embed/"
            }
        );
    };

    const renderGoogleTrend = () => {
        return <Script url={url} onLoad={handleScriptLoad} />;
    };

    return <div className="googleTrend">{renderGoogleTrend()}</div>;
}
