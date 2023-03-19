export const BuyMeACoffeeButton = () => {
  return (
    <div
      className="bg-blue-700 dark:bg-blue-100 hover:bg-blue-200 hover:text-blue-900 dark:text-blue-900 px-3 py-2 font-bold text-white rounded-full cursor-pointer"
      onClick={() => {
        chrome.tabs.create({ url: 'https://ko-fi.com/iamprompt' })
      }}
    >
      {chrome.i18n.getMessage('supportMe') || `Support me`}
    </div>
  )
}
