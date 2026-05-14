import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';
import type { DemographicData } from '../../types';

interface DemographicFormProps {
  onComplete: (demographics: DemographicData) => void;
}

export function DemographicForm({ onComplete }: DemographicFormProps) {
  const { t } = useTranslation();
  const [gender, setGender] = useState<DemographicData['gender']>();
  const [ageGroup, setAgeGroup] = useState<DemographicData['ageGroup']>();

  const genderOptions: Array<{ value: DemographicData['gender']; labelKey: string }> = [
    { value: 'male', labelKey: 'demographics.gender.male' },
    { value: 'female', labelKey: 'demographics.gender.female' },
    { value: 'other', labelKey: 'demographics.gender.other' },
    { value: 'prefer_not_to_say', labelKey: 'demographics.gender.preferNotToSay' },
  ];

  const ageGroupOptions: Array<{ value: DemographicData['ageGroup']; labelKey: string }> = [
    { value: 'under_13', labelKey: 'demographics.ageGroup.under13' },
    { value: '13_17', labelKey: 'demographics.ageGroup.13_17' },
    { value: '18_24', labelKey: 'demographics.ageGroup.18_24' },
    { value: '25_34', labelKey: 'demographics.ageGroup.25_34' },
    { value: '35_44', labelKey: 'demographics.ageGroup.35_44' },
    { value: '45_54', labelKey: 'demographics.ageGroup.45_54' },
    { value: '55_plus', labelKey: 'demographics.ageGroup.55_plus' },
  ];

  const handleContinue = () => {
    if (gender && ageGroup) {
      onComplete({ gender, ageGroup });
    }
  };

  const canContinue = gender && ageGroup;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-2xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-black">
          {t('demographics.title')}
        </h2>
        <p className="text-center text-gray-600 mb-8">
          {t('demographics.subtitle')}
        </p>

        <div className="mb-8">
          <h3 className="text-lg md:text-xl font-semibold mb-4 text-black">
            {t('demographics.gender.label')}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {genderOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setGender(option.value)}
                className={`p-3 md:p-4 rounded-xl border-2 transition-all duration-200 font-medium min-h-[44px] ${
                  gender === option.value
                    ? 'border-green-500 bg-green-500 text-white shadow-lg'
                    : 'border-gray-300 bg-white text-gray-800 hover:border-gray-500 hover:bg-gray-50'
                }`}
              >
                {t(option.labelKey)}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg md:text-xl font-semibold mb-4 text-black">
            {t('demographics.ageGroup.label')}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {ageGroupOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setAgeGroup(option.value)}
                className={`p-3 md:p-4 rounded-xl border-2 transition-all duration-200 font-medium min-h-[44px] ${
                  ageGroup === option.value
                    ? 'border-green-500 bg-green-500 text-white shadow-lg'
                    : 'border-gray-300 bg-white text-gray-800 hover:border-gray-500 hover:bg-gray-50'
                }`}
              >
                {t(option.labelKey)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={handleContinue}
            disabled={!canContinue}
            className="w-full sm:w-auto"
          >
            {t('common.next')}
          </Button>
        </div>
      </div>
    </div>
  );
}
