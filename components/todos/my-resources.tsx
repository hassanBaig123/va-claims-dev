'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import './todo-styles.css'

const MyResources: React.FC<TodoMaterialsRowProps> = ({ tier, userMeta }) => {
  const router = useRouter()

  const materials = getMaterials({
    tier,
    referralCodes: [userMeta?.referral_code],
  })
  const [downloadingFiles, setDownloadingFiles] = useState<Set<string>>(
    new Set(),
  )

  const handleDownload = async (fileId: string) => {
    setDownloadingFiles((prev) => new Set(prev).add(fileId))
    try {
      const response = await fetch(`/api/downloads?fileId=${fileId}`)
      if (response.status === 401) {
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

  if (materials?.length === 0) {
    return null
  }
  return (
    <div className="table-container">
      <div className="tableHeader">
        <div className="tableHeading">
          <p>My Resources</p>
        </div>
      </div>
      <table className="table">
        <tbody className="table-body">
          {materials.map((material, rowIndex) => (
            <tr key={rowIndex} className="table-row">
              <td className="table-cell">
                <p style={{ fontWeight: '400' }}>{material.title}</p>
                <p style={{ fontWeight: '300' }}>{material.description}</p>
              </td>
              <td className="table-cell actions">
                <p
                  className="spanBtn"
                  onClick={() => handleDownload(material.fileId)}
                >
                  {downloadingFiles.has(material.fileId)
                    ? 'Downloading...'
                    : 'Download'}
                </p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default MyResources

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
  | '1122'
  | '1234'

interface Material {
  title: string
  description: string
  fileId: string
  availableTiers: UserTier[]
}

interface TodoMaterialsRowProps {
  tier: UserTier
  userMeta: {
    referral_code: string
    isDownloaded: boolean
    welcome_message: {
      welcome_message: string
    }
    resource_urls: string[]
  }
}

const allMaterials: Material[] = [
  {
    title: 'Nexus Letter Resource 1',
    description: 'Nexus Letter Resource 1 description',
    fileId: 'Dear-Healthcare-Provider',
    availableTiers: ['1122', '1234'],
  },
  {
    title: 'Full-Nexus-Letter-Template',
    description: 'Full-Nexus-Letter-Template',
    fileId: 'Full-Nexus-Letter-Template',
    availableTiers: ['1122', '1234'],
  },
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

const getMaterials = ({
  tier,
  referralCodes,
}: {
  tier: UserTier
  referralCodes: string[]
}): Material[] => {
  return allMaterials.filter((material) =>
    [...referralCodes, tier].some((code) =>
      material.availableTiers.includes(code as UserTier),
    ),
  )
}
