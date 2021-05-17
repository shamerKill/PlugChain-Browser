import { FC, ReactElement } from 'react';
import { formatClass, getOnlyId } from '../../../tools';

const ComConTable: FC<{
  header: (string|ReactElement)[];
  content: (string|ReactElement)[][];
  tableClass?: string;
  boxClass?: string;
}> = ({
  header, content, tableClass, boxClass
}) => {
  return (
    <div className={formatClass(['control-table-box', boxClass])}>
      <table className={formatClass(['control-table', tableClass])} cellSpacing="0">
        <thead className={formatClass(['control-thead'])}>
          <tr className={formatClass(['control-tr'])}>
            {
              header.map(item => (
                <td className={formatClass(['control-td'])} key={getOnlyId()}>{ item }</td>
              ))
            }
          </tr>
        </thead>
        <tbody className={formatClass(['control-tbody'])}>
          {
            content.map(row => (
              <tr className={formatClass(['control-tr'])} key={getOnlyId()}>
                {
                  row.map(col => (
                    <td className={formatClass(['control-td'])} key={getOnlyId()}>{ col }</td>
                  ))
                }
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
};

export default ComConTable;
