import React from 'react';
import { ConstructionIcon } from 'lucide-react';
import { Page, PageHeader } from '../components/app-ui/Page';
import { ContentCard } from '../components/app-ui/ContentCard';
import { EmptyState } from '../components/app-ui/EmptyState';
export function PlaceholderPage({
  title,
  description



}: {title: string;description?: string;}) {
  return (
    <Page>
      <PageHeader title={title} description={description} />
      <ContentCard>
        <EmptyState
          icon={<ConstructionIcon className="h-5 w-5" />}
          title="Module đang được hoàn thiện"
          description="Phần này sẽ được bổ sung trong các bước tiếp theo của prototype." />
        
      </ContentCard>
    </Page>);

}