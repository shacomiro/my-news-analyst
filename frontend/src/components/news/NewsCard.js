import React from 'react';

const NewsCard = ({ news, onSelect, isSelected, showCheckbox = true }) => {
    const handleCardClick = () => {
        window.open(news.link, '_blank');
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between h-full cursor-pointer transition-shadow duration-200 hover:shadow-lg">
            <div onClick={handleCardClick} className="flex-grow">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 leading-snug">{news.title}</h3>
                <p className="text-gray-600 text-sm mb-1">
                    {news.publisher} | {news.pubDate}
                </p>
                <p className="text-gray-800 text-base mb-4 line-clamp-3">{news.description}</p>
            </div>
            {/* showCheckbox가 true일 때만 체크박스 렌더링 */}
            {showCheckbox && (
                <div className="mt-4 flex items-center">
                    <label className="inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="form-checkbox h-5 w-5 text-primary-500 accent-primary-500"
                            checked={isSelected}
                            onChange={() => onSelect(news.id)}
                            onClick={(e) => e.stopPropagation()} // 체크박스 클릭 시 카드 클릭 이벤트 방지
                        />
                        <span className="ml-2 text-gray-600">뉴스 선택</span>
                    </label>
                </div>
            )}
        </div>
    );
};

export default NewsCard;
