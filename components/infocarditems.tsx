import React from 'react';

interface InfoCardItem {
    heading?: string;
    subheading?: string;
    iconName?: string;
    descriptions?: string[];
    link?: string;
    footer?: string;
}

interface InfoCardItemsProps {
    items: InfoCardItem[];
}  



const InfoCardItems: React.FC<InfoCardItemsProps> = ({ items }) => {
    return (
      <div className="bg-white p-4 flex flex-col sm:flex-row gap-4">
        {items.map((item, index) => (
          <div key={index} className="p-4 shadow-lg rounded-lg">
            {item.heading && <h3 className="text-xl font-bold mb-2">{item.heading}</h3>}
            {item.subheading && <h4 className="text-lg font-semibold mb-2">{item.subheading}</h4>}
            {item.iconName && <i className={`icon-class ${item.iconName}`}></i>}
            {item.descriptions && item.descriptions.map((desc, descIndex) => (
              <p key={descIndex}>{desc}</p>
            ))}
            {item.link && <a href={item.link} className="btn-class">Learn More</a>}
            {item.footer && <div className="footer-class">{item.footer}</div>}
          </div>
        ))}
      </div>
    );
  };

export default InfoCardItems;

