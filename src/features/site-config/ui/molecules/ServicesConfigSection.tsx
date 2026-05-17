import { useCallback, useEffect, useState } from 'react'

import { useSiteConfig } from '@/features/site-config/model/site-config-context'
import { MAX_SERVICE_CARDS } from '@/features/site-config/model/types'
import { ServiceCardEditor } from '@/features/site-config/ui/molecules/ServiceCardEditor'
import { ServicesSubNav } from '@/features/site-config/ui/molecules/ServicesSubNav'
import {
  ConfigBlock,
  ConfigCanvas,
  ConfigGhostInput,
  ConfigGhostTextarea,
} from '@/features/site-config/ui/molecules/config-editor-primitives'
type ServicesConfigSectionProps = {
  baseId: string
}

export function ServicesConfigSection({ baseId }: ServicesConfigSectionProps) {
  const {
    config,
    updateConfig,
    updateServiceCard,
    addServiceCard,
    removeServiceCard,
    duplicateServiceCard,
    moveServiceCard,
  } = useSiteConfig()

  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (activeIndex >= config.serviceCards.length) {
      setActiveIndex(Math.max(0, config.serviceCards.length - 1))
    }
  }, [activeIndex, config.serviceCards.length])

  const canAdd = config.serviceCards.length < MAX_SERVICE_CARDS

  const handleAdd = useCallback(() => {
    const nextIndex = config.serviceCards.length
    addServiceCard()
    setActiveIndex(nextIndex)
  }, [addServiceCard, config.serviceCards.length])

  const handleRemove = useCallback(
    (index: number) => {
      removeServiceCard(index)
      setActiveIndex((prev) => {
        if (prev === index) return Math.max(0, index - 1)
        if (prev > index) return prev - 1
        return prev
      })
    },
    [removeServiceCard],
  )

  const handleDuplicate = useCallback(
    (index: number) => {
      duplicateServiceCard(index)
      setActiveIndex(index + 1)
    },
    [duplicateServiceCard],
  )

  const handleMove = useCallback(
    (index: number, direction: 'up' | 'down') => {
      const target = direction === 'up' ? index - 1 : index + 1
      moveServiceCard(index, direction)
      setActiveIndex((prev) => {
        if (prev === index) return target
        if (prev === target) return index
        return prev
      })
    },
    [moveServiceCard],
  )

  const activeCard = config.serviceCards[activeIndex] ?? null

  return (
    <ConfigCanvas>
      <ConfigBlock
        title="Encabezado de la sección"
        hint="Título y subtítulo que aparecen sobre las tarjetas en la landing."
      >
        <div className="space-y-4 text-center">
          <ConfigGhostInput
            id={`${baseId}-srv-title`}
            value={config.servicesTitle}
            onChange={(e) => updateConfig({ servicesTitle: e.target.value })}
            placeholder="Título de la sección"
            className="!text-center !text-xl sm:!text-2xl"
          />
          <ConfigGhostTextarea
            id={`${baseId}-srv-sub`}
            value={config.servicesSubtitle}
            onChange={(e) => updateConfig({ servicesSubtitle: e.target.value })}
            placeholder="Subtítulo o descripción breve"
            rows={2}
            tone="muted"
            className="!text-center !text-sm"
          />
        </div>
      </ConfigBlock>

      <ConfigBlock padding="none" className="overflow-hidden">
        <div className="border-b border-clinical-100/80 bg-clinical-50/50 px-4 py-4">
          <ServicesSubNav
            activeIndex={activeIndex}
            serviceCount={config.serviceCards.length}
            canAdd={canAdd}
            onSelect={setActiveIndex}
            onAdd={handleAdd}
          />
        </div>
        <div className="p-4 sm:p-5">
          {activeCard ? (
            <ServiceCardEditor
              key={activeCard.id}
              embedded
              card={activeCard}
              index={activeIndex}
              total={config.serviceCards.length}
              baseId={baseId}
              onUpdate={(patch) => updateServiceCard(activeIndex, patch)}
              onRemove={() => handleRemove(activeIndex)}
              onDuplicate={() => handleDuplicate(activeIndex)}
              onMoveUp={() => handleMove(activeIndex, 'up')}
              onMoveDown={() => handleMove(activeIndex, 'down')}
            />
          ) : null}
        </div>
      </ConfigBlock>

      {!canAdd ? (
        <p className="text-center text-[11px] font-medium text-clinical-400">
          Máximo {MAX_SERVICE_CARDS} servicios en la landing.
        </p>
      ) : null}
    </ConfigCanvas>
  )
}
