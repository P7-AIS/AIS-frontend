import { useEffect, useState } from 'react'
import { useAppContext } from '../contexts/appcontext'
import { useVesselGuiContext } from '../contexts/vesselGuiContext'
import { IDetailedVessel } from '../models/detailedVessel'
import ChevronSVG from '../svgs/chevronSVG'
import CloseSVG from '../svgs/closeSVG'

export default function VesselDetailsBox() {
  const { clientHandler, myDateTimeRef } = useAppContext()
  const { selectedVesselmmsi, setSelectedVesselmmsi, selectedVesselPath, setSelectedVesselPath } = useVesselGuiContext()
  const [vesselDetails, setVesselDetails] = useState<IDetailedVessel | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [pathDuration, setPathDuration] = useState<number>(1)
  const [pathIsShown, setPathIsShown] = useState<boolean>(false)
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false)

  // Fetch vessel details on selected vessel change
  useEffect(() => {
    const fetchDetails = async () => {
      if (!selectedVesselmmsi) return

      try {
        const details = await clientHandler.getVesselInfo({
          mmsi: selectedVesselmmsi,
          timestamp: myDateTimeRef.current.getTime(),
        })
        setVesselDetails(details)
      } catch (e) {
        console.error(e)
      }
    }

    fetchDetails()
    setLoading(false)
  }, [clientHandler, myDateTimeRef, selectedVesselmmsi])

  // Fetch path history on path duration change and show path
  useEffect(() => {
    async function tryGetVesselPath() {
      if (!selectedVesselmmsi) return
      try {
        const res = await clientHandler.getVesselPath({
          mmsi: selectedVesselmmsi,
          endtime: myDateTimeRef.current.getTime() / 1000,
          starttime: myDateTimeRef.current.getTime() / 1000 - pathDuration * 60 * 60,
        }) //time is in seconds
        setSelectedVesselPath(res.pathHistory.locations)
      } catch (e) {
        console.error(e)
      }
    }

    if (!pathIsShown) {
      setSelectedVesselPath([])
    } else {
      tryGetVesselPath()
    }
  }, [clientHandler, myDateTimeRef, pathDuration, pathIsShown, selectedVesselmmsi, setSelectedVesselPath])

  const vesselDetailsContent = [
    { displayName: 'Name', value: vesselDetails?.name },
    { displayName: 'MMSI', value: vesselDetails?.mmsi },
    { displayName: 'IMO', value: vesselDetails?.imo },
    { displayName: 'Ship Type', value: vesselDetails?.shipType },
    { displayName: 'Width', value: vesselDetails?.width ? `${vesselDetails?.width} m` : undefined },
    { displayName: 'Length', value: vesselDetails?.length ? `${vesselDetails?.length} m` : undefined },
    { displayName: 'Call Sign', value: vesselDetails?.callSign },
    { displayName: 'Device', value: vesselDetails?.positionFixingDevice },
  ]

  return (
    <div id="vessel-details-box" className="relative w-full min-h-200px h-fit bg-gray-700 text-white rounded-lg p-4">
      {loading ? (
        <h2 className="text-lg font-bold text-white">Loading ...</h2>
      ) : (
        vesselDetails && (
          <div>
            <h2 className="text-lg font-bold pb-3">Vessel Details</h2>
            <button
              title="Close vessel details"
              className="absolute top-4 right-4"
              onClick={() => setSelectedVesselmmsi(undefined)}
            >
              <CloseSVG />
            </button>
            {!isCollapsed && (
              <>
                <div id="vessel-info" className="flex flex-col">
                  {vesselDetailsContent.map((content, index) => (
                    <div
                      className="flex flex-row gap-3 py-1 px-2 rounded-md even:bg-gray-700 odd:bg-gray-600 text-sm"
                      key={index}
                    >
                      <p className="w-20 font-semibold">{content.displayName}</p>
                      <p title={content.value?.toString()} className="truncate">
                        {content.value}
                      </p>
                    </div>
                  ))}
                </div>
                <hr className="my-3 border-2 border-gray-600 rounded-md" />
                <div className="flex flex-row justify-between items-center gap-2">
                  <div className="flex flex-row gap-2">
                    <div className="m-0 font-semibold">Path history (h)</div>
                    <input
                      className="w-12 rounded-md text-center bg-gray-600"
                      type="number"
                      min="0"
                      max="24"
                      placeholder="Path duration Hours"
                      value={pathDuration}
                      onChange={(e) => setPathDuration(Math.max(0, parseFloat(e.target.value)))}
                    ></input>
                  </div>

                  <button className="blue-badge w-24 py-1" onClick={() => setPathIsShown(!pathIsShown)}>
                    {selectedVesselPath.length > 0 ? 'Hide Path' : 'Show Path'}
                  </button>
                </div>
              </>
            )}
            <button
              title="Hide/show vessel details"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`w-full flex flex-cols items-center justify-center bottom-0 ${!isCollapsed && 'mt-4'}`}
            >
              {isCollapsed ? <ChevronSVG rotate={180} /> : <ChevronSVG />}
            </button>
          </div>
        )
      )}
    </div>
  )
}
