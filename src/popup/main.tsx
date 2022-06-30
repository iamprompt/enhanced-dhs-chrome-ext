import type { ChangeEvent } from 'react'
import { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'

import '../styles/tailwind.css'

import { sendMessage } from 'webext-bridge'
import type { FontCategoryOptions, selectedOptions } from '../@types/options'

import { getUserPreferences } from '../utils/chrome'
import Header from './components/header'
import Footer from './components/footer'

import NotCompatInfo from './components/notCompat'
import {
  ColorOptions,
  EdgeStyleOptions,
  FontOptions,
  FontSizeOptions,
  FontWeightText,
} from '../config'
import { DefaultOptions } from '../config'

const App = () => {
  const [selectedOpt, setSelectedOpt] =
    useState<selectedOptions>(DefaultOptions)
  const [isLoaded, setLoaded] = useState<boolean>(false)
  const [isChanged, setChanged] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<chrome.tabs.Tab>()

  const [isColorPickerOpen, toggleColorPicker] = useState<boolean>(false)

  const FontCategoryOptions: FontCategoryOptions = {}
  Object.entries(FontOptions).forEach(([key, val]) => {
    FontCategoryOptions[val.category] = {
      ...FontCategoryOptions[val.category],
      [key]: val,
    }
  })

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      setActiveTab(tabs[0])
    })

    getUserPreferences().then((userPreferences) => {
      setSelectedOpt(userPreferences)
      setLoaded(true)
    })
  }, [])

  useEffect(() => {
    if (activeTab && activeTab.id) {
      // console.log(selectedOpt)
      chrome.storage.local.set({ options: selectedOpt })

      if (isLoaded && !isChanged) {
        setChanged(true)
      }

      sendMessage(
        'updatePreferences',
        { preferencesChange: true },
        { context: 'content-script', tabId: activeTab.id }
      )
    }
  }, [selectedOpt])

  const fontFamilySelHandler = (e: ChangeEvent<HTMLSelectElement>) =>
    setSelectedOpt((prev) => ({
      ...prev,
      fontFamily: e.target.value,
      fontWeight: FontOptions[e.target.value].defaultFontWeight,
    }))

  const fontSizeSelHandler = (selectedSize: number) =>
    setSelectedOpt((prev) => ({ ...prev, fontSize: selectedSize }))

  const fontPosition = (selectedPosition: number) =>
    setSelectedOpt((prev) => ({ ...prev, fontPosition: selectedPosition }))

  const subtitleBgOpacityHandler = (selectedOpacity: number) =>
    setSelectedOpt((prev) => ({
      ...prev,
      subtitleBg: { ...prev.subtitleBg, opacity: selectedOpacity },
    }))

  const ReloadHandler = () => {
    if (activeTab && activeTab.id) {
      chrome.tabs.reload(activeTab.id)
      window.close()
    }
  }

  return (
    <div className="w-72 relative">
      <Header />
      <div className="pt-14 pb-12 text-black bg-gray-50 dark:text-white dark:from-[#192133] dark:to-[#111826] dark:bg-gradient-to-b">
        {activeTab?.url?.search('hotstar.com') !== -1 ||
        activeTab?.url?.search('dev=1') !== -1 ? (
          <div id="content" className="p-3 flex flex-col space-y-3">
            <h2 id="subtitle-title" className="font-bold text-2xl">
              {chrome.i18n.getMessage('popupSubtitleTitle')}
            </h2>

            <div id="font-family-option">
              <h3 className="font-bold text-lg text-gray-900 dark:text-gray-50">
                {chrome.i18n.getMessage('popupFontOptionTitle')}
              </h3>

              <select
                name="font-family"
                id="font-family"
                className="w-full p-1 px-2 border border-gray-300 bg-white dark:bg-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                onChange={fontFamilySelHandler}
                value={selectedOpt?.fontFamily}
              >
                {Object.entries(FontCategoryOptions).map(([key, val]) => {
                  return (
                    <optgroup
                      key={key}
                      label={
                        chrome.i18n.getMessage(`popupFontText${key}`) || key
                      }
                    >
                      {Object.entries(val).map(([k, v]) => {
                        return (
                          <option key={k} value={k}>
                            {v.title}
                          </option>
                        )
                      })}
                    </optgroup>
                  )
                })}
              </select>

              <div className="mt-2 grid grid-cols-3 gap-2">
                <select
                  name="font-weight"
                  id="font-weight"
                  className="col-span-2 w-full p-1 px-2 border border-gray-300 bg-white dark:bg-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    setSelectedOpt((prev) => ({
                      ...prev,
                      fontWeight: parseInt(e.target.value),
                    }))
                  }
                  value={selectedOpt?.fontWeight}
                >
                  <optgroup label={FontOptions[selectedOpt.fontFamily].title}>
                    {FontOptions[selectedOpt.fontFamily].weight.map((w) => {
                      return (
                        <option
                          key={`${selectedOpt.fontFamily}-${w}`}
                          value={w}
                        >
                          {FontWeightText[w]}
                        </option>
                      )
                    })}
                  </optgroup>
                </select>
                <div
                  className={`h-full w-full border border-gray-300 rounded-md shadow-sm cursor-pointer`}
                  style={{ backgroundColor: selectedOpt.fontColor }}
                  onClick={() => toggleColorPicker(!isColorPickerOpen)}
                />
              </div>

              {isColorPickerOpen && (
                <div className="mt-2 grid grid-cols-5 gap-1">
                  {ColorOptions.map((c) => {
                    return (
                      <div
                        key={c}
                        className="col-span-1 h-8 w-full border border-gray-300 rounded-sm shadow-sm flex justify-center items-center cursor-pointer"
                        style={{ backgroundColor: c }}
                        onClick={() => {
                          setSelectedOpt((prev) => ({ ...prev, fontColor: c }))
                          toggleColorPicker(false)
                        }}
                      >
                        {selectedOpt.fontColor === c && (
                          <span className="material-icons-round text-gray-300 select-none">
                            check
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            <div id="font-size-selection">
              <h3 className="font-bold text-lg text-gray-900 dark:text-gray-50">
                {chrome.i18n.getMessage('popupFontSizeOptionTitle')}:{' '}
                <span id="font-size-text">{`+${selectedOpt.fontSize}`}</span>
              </h3>
              <div className="grid grid-cols-3 border border-gray-300 shadow-sm divide-x h-8">
                {Object.entries(FontSizeOptions).map(([key, val]) => {
                  return (
                    <div
                      key={key}
                      id={`font-size-${key}`}
                      className={`flex items-center justify-center w-full h-full cursor-pointer bg-white dark:bg-gray-600 ${
                        val.classText
                      }${
                        selectedOpt?.fontSize >= val.plusSize
                          ? ` bg-gradient-to-r from-blue-900 to-blue-700 text-white`
                          : ``
                      }`}
                      onClick={() => fontSizeSelHandler(val.plusSize)}
                    >
                      A
                    </div>
                  )
                })}
              </div>
              <div className="mt-3">
                <input
                  type="range"
                  className="w-full"
                  min={0}
                  max={100}
                  step={5}
                  value={selectedOpt.fontSize}
                  onChange={(e) => {
                    fontSizeSelHandler(parseInt(e.target.value))
                  }}
                />
              </div>
            </div>

            <div id="font-position-arrange">
              <h3 className="font-bold text-lg text-gray-900 dark:text-gray-50">
                {chrome.i18n.getMessage('popupSubtitleBgOptionTitle') ||
                  `Subtitle Background Opacity`}
              </h3>
              <div className="mt-3 grid grid-cols-12 gap-x-2">
                <input
                  type="range"
                  className="col-span-10 w-full"
                  min={0}
                  max={1}
                  step={0.1}
                  value={selectedOpt.subtitleBg.opacity}
                  onChange={(e) => {
                    subtitleBgOpacityHandler(parseFloat(e.target.value))
                  }}
                />
                <span className="font-bold text-md col-span-2 text-right">{`${
                  selectedOpt.subtitleBg.opacity * 100
                }%`}</span>
              </div>
            </div>

            <div id="font-position-arrange">
              <h3 className="font-bold text-lg text-gray-900 dark:text-gray-50">
                {chrome.i18n.getMessage('popupFontPositionOptionTitle') ||
                  `Position`}
              </h3>
              <div className="mt-3 grid grid-cols-12 gap-x-2">
                <input
                  type="range"
                  className="col-span-10 w-full"
                  min={-10}
                  max={10}
                  step={1}
                  value={selectedOpt.fontPosition}
                  onChange={(e) => {
                    fontPosition(parseInt(e.target.value))
                  }}
                />
                <span className="font-bold text-md col-span-2 text-right">{`${selectedOpt.fontPosition}%`}</span>
              </div>
            </div>

            <div id="edge-style-options">
              <h3 className="font-bold text-lg text-gray-900 dark:text-gray-50">
                {chrome.i18n.getMessage('popupEdgeStyleOptionTitle')}
              </h3>
              <div>
                <select
                  name="edge-style"
                  id="edge-style"
                  className="w-full p-1 px-2 border border-gray-300 bg-white dark:bg-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  onChange={(e) =>
                    setSelectedOpt((prev) => ({
                      ...prev,
                      edgeStyle: { ...prev.edgeStyle, style: e.target.value },
                    }))
                  }
                  value={selectedOpt?.edgeStyle?.style}
                >
                  {Object.entries(EdgeStyleOptions).map(([key, val]) => {
                    return (
                      <option value={key} key={key}>
                        {val.textLocale
                          ? chrome.i18n.getMessage(val.textLocale as string)
                          : val.text}
                      </option>
                    )
                  })}
                </select>
              </div>
            </div>

            <div id="additional-settings">
              <h3 className="font-bold text-lg text-gray-900 dark:text-gray-50">
                {chrome.i18n.getMessage('popupAdditionalSettingTitle')}
              </h3>
              <div className="mt-2 space-y-2">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="noWatermark"
                      name="noWatermark"
                      type="checkbox"
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      onChange={() =>
                        setSelectedOpt((prev) => ({
                          ...prev,
                          noWatermark: !selectedOpt.noWatermark,
                        }))
                      }
                      checked={selectedOpt.noWatermark}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="NoWatermark"
                      className="font-medium text-gray-700 dark:text-gray-50"
                    >
                      {chrome.i18n.getMessage('popupNoWatermarkText')}
                    </label>
                    <p className="text-gray-500 dark:text-gray-100">
                      {chrome.i18n.getMessage('popupNoWatermarkDetail')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {isChanged && (
              <div
                id="footer-note"
                className="flex text-center text-red-600 dark:text-red-500 items-center justify-center font-bold"
              >
                {chrome.i18n.getMessage('popupRefreshText')}{' '}
                <div className="cursor-pointer pl-2" onClick={ReloadHandler}>
                  <svg
                    className="h-5 w-5 fill-current text-blue-900 dark:text-blue-600"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle cx="12" cy="12" r="12" fill="current-color" />
                    <path
                      d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"
                      fill="white"
                    />
                  </svg>
                </div>
              </div>
            )}
          </div>
        ) : (
          <NotCompatInfo activeTabId={activeTab.id as number} />
        )}
      </div>

      <Footer />
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
