const NotCompatInfo = ({ activeTabId }: { activeTabId: number }) => {
  return (
    <div className="p-3 flex flex-col space-y-3 justify-center items-center">
      <h2 className="text-base text-center">
        {chrome.i18n.getMessage('popupOnlyWorkingDomain') ||
          `This extension only works on`}{' '}
        <span className="font-bold text-blue-900 dark:text-blue-500">
          *.hotstar.com
        </span>
      </h2>

      <div
        className="bg-blue-700 dark:bg-blue-100 hover:bg-blue-200 hover:text-blue-900 dark:text-blue-900 px-3 py-2 font-bold text-white rounded-full cursor-pointer"
        onClick={() => {
          chrome.tabs.update(activeTabId, { url: 'https://hotstar.com/' })
          window.close()
        }}
      >
        {chrome.i18n.getMessage('popupHotstarCTA') || `Go to hotstar.com`}
      </div>
    </div>
  )
}

export default NotCompatInfo
