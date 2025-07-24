import React from 'react';

interface LookerReportProps {
  width?: string;
  height?: string;
}

const LookerReport: React.FC<LookerReportProps> = ({
                                                     width = "1024",
                                                     height = "500"
                                                   }) => {
  return (
    <section>
      <h1 className="text-2xl font-bold mb-4">Looker Studio Dashboard</h1>

      <div className="flex justify-center items-center">
        <iframe
          width={width}
          height={height}
          src="https://lookerstudio.google.com/embed/reporting/b8257606-4c21-44be-a4ff-f19ce937776b/page/1ZQSF"
          style={{border: 0}}
          allowFullScreen
          sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
        />
      </div>
    </section>
  );
};

export default LookerReport;
