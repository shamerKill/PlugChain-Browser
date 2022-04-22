import { FC, useCallback, useState } from 'react';

export const accountTypeEnum: {
	prc10: 'PRC10';
	prc20: 'PRC20';
} = {
	prc10: 'PRC10',
	prc20: 'PRC20'
};
type ValueOf<T> = T[keyof T];
export type typeAccountType = ValueOf<typeof accountTypeEnum>;

export const ComAccountsType: FC<{
	type?: typeAccountType,
	onChange?: (type: typeAccountType) => void,
}> = ({
	type = accountTypeEnum.prc20,
	onChange,
}) => {
	const [_type, _setType] = useState(type);
	const select = useCallback((selected: typeAccountType) => {
		_setType(selected);
		if (onChange) onChange(selected);
	}, [onChange, _setType]);

	return (
		<div className='control-radio-box'>
			<label className='control-radio-label' htmlFor={accountTypeEnum.prc20}>
				<input
					className='control-radio'
					id={accountTypeEnum.prc20}
					defaultChecked={_type === accountTypeEnum.prc20}
					onClick={() => select(accountTypeEnum.prc20)}
					value={accountTypeEnum.prc20}
					type="radio"
					name="account-type" />
				<span className='control-radio-span'>{accountTypeEnum.prc20}</span>
			</label>
			<div className='control-radio-space'></div>
			<label className='control-radio-label' htmlFor={accountTypeEnum.prc10}>
				<input
					className='control-radio'
					id={accountTypeEnum.prc10}
					defaultChecked={_type === accountTypeEnum.prc10}
					onClick={() => select(accountTypeEnum.prc10)}
					value={accountTypeEnum.prc10}
					type="radio"
					name="account-type" />
				<span className='control-radio-span'>{accountTypeEnum.prc10}</span>
			</label>
		</div>
	);
};
