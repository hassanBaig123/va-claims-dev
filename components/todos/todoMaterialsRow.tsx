'use client'

import React, { useState } from 'react'
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBook, faDownload } from '@fortawesome/pro-light-svg-icons'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils'
import { useRouter } from 'next/navigation'

// TODO: this component will be deprecated after todos revamp
// we need to remove it

type UserTier =
  | 'bronze'
  | 'silver'
  | 'gold'
  | 'upgrade_bronze_to_silver'
  | 'upgrade_bronze_to_gold'
  | 'upgrade_silver_to_gold'
  | 'one_time_pay_test'
  | 'grandmaster'
  | 'master'
  | 'expert'
  | 'upgrade_expert_to_master'
  | 'upgrade_master_to_grandmaster'
  | 'upgrade_expert_to_grandmaster'

interface Material {
  title: string
  description: string
  fileId: string
  availableTiers: UserTier[]
}

interface TodoMaterialsRowProps {
  tier: UserTier
}

const allMaterials: Material[] = [
  {
    title: 'Back Pain Bilateral Radiculopathy Personal Statement',
    description:
      'Template for back pain bilateral radiculopathy personal statement.',
    fileId: 'BACK-PAIN-PS-TEMPLATE',
    availableTiers: [
      'bronze',
      'silver',
      'gold',
      'upgrade_bronze_to_silver',
      'upgrade_bronze_to_gold',
      'upgrade_silver_to_gold',
      'one_time_pay_test',
      'grandmaster',
      'master',
      'expert',
      'upgrade_expert_to_master',
      'upgrade_master_to_grandmaster',
      'upgrade_expert_to_grandmaster',
    ],
  },
  {
    title: 'Bilateral Pes Planus Personal Statement Template',
    description: 'Template for bilateral pes planus personal statement.',
    fileId: '30-PES-PLANUS-FLAT-FEET-PS-TEMPLATE',
    availableTiers: [
      'bronze',
      'silver',
      'gold',
      'upgrade_bronze_to_silver',
      'upgrade_bronze_to_gold',
      'upgrade_silver_to_gold',
      'one_time_pay_test',
      'grandmaster',
      'master',
      'expert',
      'upgrade_expert_to_master',
      'upgrade_master_to_grandmaster',
      'upgrade_expert_to_grandmaster',
    ],
  },
  {
    title: 'Bilateral Plantar Fasciitis Personal Statement Template',
    description: 'Template for bilateral plantar fasciitis personal statement.',
    fileId: '10-BL-Plantar-Fasciitus-PS-TEMPLATE',
    availableTiers: [
      'bronze',
      'silver',
      'gold',
      'upgrade_bronze_to_silver',
      'upgrade_bronze_to_gold',
      'upgrade_silver_to_gold',
      'one_time_pay_test',
      'grandmaster',
      'master',
      'expert',
      'upgrade_expert_to_master',
      'upgrade_master_to_grandmaster',
      'upgrade_expert_to_grandmaster',
    ],
  },
  {
    title: 'Bonus VA Claim Checklist',
    description: 'Checklist for bonus VA claims.',
    fileId: 'VA-Claims-Checklist-Bonus1',
    availableTiers: [
      'bronze',
      'silver',
      'gold',
      'upgrade_bronze_to_silver',
      'upgrade_bronze_to_gold',
      'upgrade_silver_to_gold',
      'one_time_pay_test',
      'grandmaster',
      'master',
      'expert',
      'upgrade_expert_to_master',
      'upgrade_master_to_grandmaster',
      'upgrade_expert_to_grandmaster',
    ],
  },
  {
    title: 'Chronic Fatigue Syndrome Personal Statement',
    description: 'Template for chronic fatigue syndrome personal statement.',
    fileId: '100-CHRONIC-FATIGUE-SYNDROME-PS-TEMPLATE',
    availableTiers: [
      'bronze',
      'silver',
      'gold',
      'upgrade_bronze_to_silver',
      'upgrade_bronze_to_gold',
      'upgrade_silver_to_gold',
      'one_time_pay_test',
      'grandmaster',
      'master',
      'expert',
      'upgrade_expert_to_master',
      'upgrade_master_to_grandmaster',
      'upgrade_expert_to_grandmaster',
    ],
  },
  {
    title: 'Fibromyalgia Personal Statement Template',
    description: 'Template for fibromyalgia personal statement.',
    fileId: '40-FIBROMYALGIA-PS-TEMPLATE',
    availableTiers: [
      'bronze',
      'silver',
      'gold',
      'upgrade_bronze_to_silver',
      'upgrade_bronze_to_gold',
      'upgrade_silver_to_gold',
      'one_time_pay_test',
      'grandmaster',
      'master',
      'expert',
      'upgrade_expert_to_master',
      'upgrade_master_to_grandmaster',
      'upgrade_expert_to_grandmaster',
    ],
  },
  {
    title: 'Generic Nexus Letter Word Document',
    description: 'Template for a generic nexus letter.',
    fileId: 'genericnexusletter',
    availableTiers: [
      'bronze',
      'silver',
      'gold',
      'upgrade_bronze_to_silver',
      'upgrade_bronze_to_gold',
      'upgrade_silver_to_gold',
      'one_time_pay_test',
      'grandmaster',
      'master',
      'expert',
      'upgrade_expert_to_master',
      'upgrade_master_to_grandmaster',
      'upgrade_expert_to_grandmaster',
    ],
  },
  {
    title: 'Generic Nexus Letter Template PDF',
    description: 'PDF template for a generic nexus letter.',
    fileId: 'GenericNexusLetterTemplate',
    availableTiers: [
      'bronze',
      'silver',
      'gold',
      'upgrade_bronze_to_silver',
      'upgrade_bronze_to_gold',
      'upgrade_silver_to_gold',
      'one_time_pay_test',
      'grandmaster',
      'master',
      'expert',
      'upgrade_expert_to_master',
      'upgrade_master_to_grandmaster',
      'upgrade_expert_to_grandmaster',
    ],
  },
  {
    title: 'Gulf War Vets MUCMI Personal Statement',
    description: 'Template for Gulf War Vets MUCMI personal statement.',
    fileId: 'GULF-WAR-MUCMI-PS-TEMPLATE',
    availableTiers: [
      'bronze',
      'silver',
      'gold',
      'upgrade_bronze_to_silver',
      'upgrade_bronze_to_gold',
      'upgrade_silver_to_gold',
      'one_time_pay_test',
      'grandmaster',
      'master',
      'expert',
      'upgrade_expert_to_master',
      'upgrade_master_to_grandmaster',
      'upgrade_expert_to_grandmaster',
    ],
  },
  {
    title: 'Hearing Loss Personal Statement',
    description: 'Template for hearing loss personal statement.',
    fileId: 'HEARING-LOSS-PS-STATEMENT-TEMPLATE',
    availableTiers: [
      'bronze',
      'silver',
      'gold',
      'upgrade_bronze_to_silver',
      'upgrade_bronze_to_gold',
      'upgrade_silver_to_gold',
      'one_time_pay_test',
      'grandmaster',
      'master',
      'expert',
      'upgrade_expert_to_master',
      'upgrade_master_to_grandmaster',
      'upgrade_expert_to_grandmaster',
    ],
  },
  {
    title: 'Insomnia Secondary to Tinnitus',
    description: 'Information on insomnia secondary to tinnitus.',
    fileId: 'Insomnia-Due-to-Tinnitus-PS-Template-FINAL-DRAFT',
    availableTiers: [
      'bronze',
      'silver',
      'gold',
      'upgrade_bronze_to_silver',
      'upgrade_bronze_to_gold',
      'upgrade_silver_to_gold',
      'one_time_pay_test',
      'grandmaster',
      'master',
      'expert',
      'upgrade_expert_to_master',
      'upgrade_master_to_grandmaster',
      'upgrade_expert_to_grandmaster',
    ],
  },
  {
    title: '70% MENTAL PERSONAL STATEMENT TEMPLATE',
    description: 'PDF template for mental conditions personal statement.',
    fileId: 'Mental-Conditions-PS-Template',
    availableTiers: [
      'bronze',
      'silver',
      'gold',
      'upgrade_bronze_to_silver',
      'upgrade_bronze_to_gold',
      'upgrade_silver_to_gold',
      'one_time_pay_test',
      'grandmaster',
      'master',
      'expert',
      'upgrade_expert_to_master',
      'upgrade_master_to_grandmaster',
      'upgrade_expert_to_grandmaster',
    ],
  },
  {
    title: '50% HEADACHES PERSONAL STATEMENT TEMPLATE',
    description: 'PDF template for migraines personal statement.',
    fileId: 'Migraines-PS-Template',
    availableTiers: [
      'bronze',
      'silver',
      'gold',
      'upgrade_bronze_to_silver',
      'upgrade_bronze_to_gold',
      'upgrade_silver_to_gold',
      'one_time_pay_test',
      'grandmaster',
      'master',
      'expert',
      'upgrade_expert_to_master',
      'upgrade_master_to_grandmaster',
      'upgrade_expert_to_grandmaster',
    ],
  },
  {
    title: 'NECK PAIN + BL RADICULOPATHY PERSONAL STATEMENT TEMPLATE',
    description:
      'Template for neck pain bilateral radiculopathy personal statement.',
    fileId: 'NECK-Plus-BL-Radiculopathy-PS-TEMPLATE',
    availableTiers: [
      'bronze',
      'silver',
      'gold',
      'upgrade_bronze_to_silver',
      'upgrade_bronze_to_gold',
      'upgrade_silver_to_gold',
      'one_time_pay_test',
      'grandmaster',
      'master',
      'expert',
      'upgrade_expert_to_master',
      'upgrade_master_to_grandmaster',
      'upgrade_expert_to_grandmaster',
    ],
  },
  {
    title: 'New (2024) Insomnia Nexus Letter as Secondary Claim',
    description: 'PDF template for insomnia as a secondary condition.',
    fileId: 'NL-Template-Insomnia-as-a-SECONDARY-Updated-2024',
    availableTiers: [
      'bronze',
      'silver',
      'gold',
      'upgrade_bronze_to_silver',
      'upgrade_bronze_to_gold',
      'upgrade_silver_to_gold',
      'one_time_pay_test',
      'grandmaster',
      'master',
      'expert',
      'upgrade_expert_to_master',
      'upgrade_master_to_grandmaster',
      'upgrade_expert_to_grandmaster',
    ],
  },
  {
    title: 'Ratings Calculator',
    description: 'Excel file for calculating ratings.',
    fileId: 'VA-Disability-Calculator-SAVE-AS-FIRST',
    availableTiers: [
      'bronze',
      'silver',
      'gold',
      'upgrade_bronze_to_silver',
      'upgrade_bronze_to_gold',
      'upgrade_silver_to_gold',
      'one_time_pay_test',
      'grandmaster',
      'master',
      'expert',
      'upgrade_expert_to_master',
      'upgrade_master_to_grandmaster',
      'upgrade_expert_to_grandmaster',
    ],
  },
  {
    title: '30% RHINITIS PS TEMPLATE',
    description: 'Template for rhinitis personal statement.',
    fileId: '30-RHINITIS-PS-TEMPLATE',
    availableTiers: [
      'bronze',
      'silver',
      'gold',
      'upgrade_bronze_to_silver',
      'upgrade_bronze_to_gold',
      'upgrade_silver_to_gold',
      'one_time_pay_test',
      'grandmaster',
      'master',
      'expert',
      'upgrade_expert_to_master',
      'upgrade_master_to_grandmaster',
      'upgrade_expert_to_grandmaster',
    ],
  },
  {
    title: '30% SINUSITIS PS TEMPLATE',
    description: 'Template for sinusitis personal statement.',
    fileId: '30-SINUSITIS-PS-TEMPLATE',
    availableTiers: [
      'bronze',
      'silver',
      'gold',
      'upgrade_bronze_to_silver',
      'upgrade_bronze_to_gold',
      'upgrade_silver_to_gold',
      'one_time_pay_test',
      'grandmaster',
      'master',
      'expert',
      'upgrade_expert_to_master',
      'upgrade_master_to_grandmaster',
      'upgrade_expert_to_grandmaster',
    ],
  },
  {
    title: '50% SLEEP APNEA PERSONAL STATEMENT TEMPLATE',
    description: 'PDF template for sleep apnea personal statement.',
    fileId: 'Sleep-Apnea-PS-Template',
    availableTiers: [
      'bronze',
      'silver',
      'gold',
      'upgrade_bronze_to_silver',
      'upgrade_bronze_to_gold',
      'upgrade_silver_to_gold',
      'one_time_pay_test',
      'grandmaster',
      'master',
      'expert',
      'upgrade_expert_to_master',
      'upgrade_master_to_grandmaster',
      'upgrade_expert_to_grandmaster',
    ],
  },
  {
    title: '10% TINNITUS PS TEMPLATE',
    description: 'Template for tinnitus personal statement.',
    fileId: '10-TINNITUS-PS-STATEMENT-TEMPLATE',
    availableTiers: [
      'bronze',
      'silver',
      'gold',
      'upgrade_bronze_to_silver',
      'upgrade_bronze_to_gold',
      'upgrade_silver_to_gold',
      'one_time_pay_test',
      'grandmaster',
      'master',
      'expert',
      'upgrade_expert_to_master',
      'upgrade_master_to_grandmaster',
      'upgrade_expert_to_grandmaster',
    ],
  },
  {
    title: '**UPDATED 2024** GERD PERSONAL STATEMENT TEMPLATE',
    description: 'PDF template for GERD personal statement.',
    fileId: 'UPDATED-GERD-Personal-Statement-Template-1',
    availableTiers: [
      'bronze',
      'silver',
      'gold',
      'upgrade_bronze_to_silver',
      'upgrade_bronze_to_gold',
      'upgrade_silver_to_gold',
      'one_time_pay_test',
      'grandmaster',
      'master',
      'expert',
      'upgrade_expert_to_master',
      'upgrade_master_to_grandmaster',
      'upgrade_expert_to_grandmaster',
    ],
  },
  {
    title: '**UPDATED 2024** IBS PERSONAL STATEMENT TEMPLATE',
    description: 'PDF template for IBS nexus letter.',
    fileId: 'UPDATED-IBS-Nexus-Letter-Template',
    availableTiers: [
      'bronze',
      'silver',
      'gold',
      'upgrade_bronze_to_silver',
      'upgrade_bronze_to_gold',
      'upgrade_silver_to_gold',
      'one_time_pay_test',
      'grandmaster',
      'master',
      'expert',
      'upgrade_expert_to_master',
      'upgrade_master_to_grandmaster',
      'upgrade_expert_to_grandmaster',
    ],
  },
  {
    title: 'VA PAY CHART',
    description: 'Excel file containing VA pay information.',
    fileId: 'Ratings-Chart-Custom-1',
    availableTiers: [
      'bronze',
      'silver',
      'gold',
      'upgrade_bronze_to_silver',
      'upgrade_bronze_to_gold',
      'upgrade_silver_to_gold',
      'one_time_pay_test',
      'grandmaster',
      'master',
      'expert',
      'upgrade_expert_to_master',
      'upgrade_master_to_grandmaster',
      'upgrade_expert_to_grandmaster',
    ],
  },
  {
    title: 'PTSD Personal Statement Form (21-0781)',
    description: 'PTSD Personal Statement Form (21-0781) in PDF format.',
    fileId: 'VBA-21-0781a',
    availableTiers: [
      'bronze',
      'silver',
      'gold',
      'upgrade_bronze_to_silver',
      'upgrade_bronze_to_gold',
      'upgrade_silver_to_gold',
      'one_time_pay_test',
      'grandmaster',
      'master',
      'expert',
      'upgrade_expert_to_master',
      'upgrade_master_to_grandmaster',
      'upgrade_expert_to_grandmaster',
    ],
  },
  {
    title: 'MST (Military Sexual Trauma) Personal Statement Form',
    description:
      'MST (Military Sexual Trauma) Personal Statement Form in PDF format.',
    fileId: 'VBA-21-0781a-ARE',
    availableTiers: [
      'bronze',
      'silver',
      'gold',
      'upgrade_bronze_to_silver',
      'upgrade_bronze_to_gold',
      'upgrade_silver_to_gold',
      'one_time_pay_test',
      'grandmaster',
      'master',
      'expert',
      'upgrade_expert_to_master',
      'upgrade_master_to_grandmaster',
      'upgrade_expert_to_grandmaster',
    ],
  },
  {
    title: 'PERSONAL/BUDDY STATEMENT FORM (Statement in Support of a Clam)',
    description:
      'PERSONAL/BUDDY STATEMENT FORM (Statement in Support of a Clam) form in PDF format.',
    fileId: 'VBA-21-4138-ARE',
    availableTiers: [
      'bronze',
      'silver',
      'gold',
      'upgrade_bronze_to_silver',
      'upgrade_bronze_to_gold',
      'upgrade_silver_to_gold',
      'one_time_pay_test',
      'grandmaster',
      'master',
      'expert',
      'upgrade_expert_to_master',
      'upgrade_master_to_grandmaster',
      'upgrade_expert_to_grandmaster',
    ],
  },
  {
    title: '100% VERTIGO/MENIERES DISEASE PS TEMPLATE',
    description: "Template for vertigo Meniere's disease personal statement.",
    fileId: '100-VERTIGO-MENIERES-DISEASE-PS-TEMPLATE',
    availableTiers: [
      'bronze',
      'silver',
      'gold',
      'upgrade_bronze_to_silver',
      'upgrade_bronze_to_gold',
      'upgrade_silver_to_gold',
      'one_time_pay_test',
      'grandmaster',
      'master',
      'expert',
      'upgrade_expert_to_master',
      'upgrade_master_to_grandmaster',
      'upgrade_expert_to_grandmaster',
    ],
  },
  {
    title: 'WHERE ARE MY SERVICE TREATMENT RECORDS?',
    description: 'Image file for "Where are my service treatment records?"',
    fileId: 'Where_REcords',
    availableTiers: [
      'bronze',
      'silver',
      'gold',
      'upgrade_bronze_to_silver',
      'upgrade_bronze_to_gold',
      'upgrade_silver_to_gold',
      'one_time_pay_test',
      'grandmaster',
      'master',
      'expert',
      'upgrade_expert_to_master',
      'upgrade_master_to_grandmaster',
      'upgrade_expert_to_grandmaster',
    ],
  },
]
const getMaterials = (tier: UserTier): Material[] => {
  return allMaterials.filter((material) =>
    material.availableTiers.includes(tier),
  )
}

const TodoMaterialsRow: React.FC<TodoMaterialsRowProps> = ({ tier }) => {
  const materials = getMaterials(tier)
  const router = useRouter()
  const [downloadingFiles, setDownloadingFiles] = useState<Set<string>>(
    new Set(),
  )

  const handleDownload = async (fileId: string) => {
    setDownloadingFiles((prev) => new Set(prev).add(fileId))
    try {
      const response = await fetch(`/api/downloads?fileId=${fileId}`)

      if (response.status === 401) {
        // User is not authenticated, redirect to login page
        router.push('/login')
        return
      }

      if (!response.ok) {
        throw new Error('Download failed')
      }

      const blob = await response.blob()
      const filename =
        response.headers.get('Content-Disposition')?.split('filename=')[1] ||
        'download'

      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()

      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error downloading file:', error)
      alert('An error occurred while downloading the file. Please try again.')
    } finally {
      setDownloadingFiles((prev) => {
        const newSet = new Set(prev)
        newSet.delete(fileId)
        return newSet
      })
    }
  }

  return (
    <AccordionItem value="materials">
      <AccordionTrigger
        className={cn('hover:bg-slate-100 min-h-[10rem] sm:min-h-7')}
      >
        <div className="flex w-full justify-between flex-wrap">
          <div className="flex w-full md:w-auto items-center">
            <FontAwesomeIcon
              icon={faBook}
              className="w-4 h-4 md:w-7 md:h-7 mr-2"
            />
            <span className="w-full md:w-auto text-lg font-light">
              My Resources
              <span className="text-xs md:text-sm ml-4 text-amber-500 todo-requirement">
                Recommended
              </span>
            </span>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-4">
          {materials.map((material, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50 hover:bg-gray-100 p-4 rounded-lg"
            >
              <div>
                <h3 className="text-lg font-lexend-deca ">{material.title}</h3>
                <p className="text-sm text-gray-600">{material.description}</p>
              </div>
              <Button
                variant="outline"
                className="mt-2 sm:mt-0"
                onClick={() => handleDownload(material.fileId)}
                disabled={downloadingFiles.has(material.fileId)}
              >
                <FontAwesomeIcon icon={faDownload} className="mr-2" />
                {downloadingFiles.has(material.fileId)
                  ? 'Downloading...'
                  : 'Download'}
              </Button>
            </div>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}

export default TodoMaterialsRow
