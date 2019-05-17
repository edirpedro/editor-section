/**
 * BLOCK: editor-section
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//  Import CSS.
import './style.scss';
import './editor.scss';

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks
const classBlock = 'wp-block-cgb-block-editor-section';

export const {
	InspectorControls,
	BlockControls,
	ColorPalette,
	MediaUpload,
	InnerBlocks,
} = wp.editor;

export const {
	BaseControl,
	Button,
	PanelBody,
	PanelColor,
	ColorIndicator,
	ToggleControl,
	SelectControl,
	IconButton,
	RangeControl,
	ButtonGroup,
	Spinner,
} = wp.components;

const section = ( attributes ) => {
	
	let result = {};
	
	Object.assign( result, {
		backgroundColor: attributes.backgroundColor,
	} );
	
	return result;
	
}

const image = ( attributes ) => {
	
	let result = {};

	Object.assign( result, {
		backgroundImage: attributes.backgroundImage ? `url(${ attributes.backgroundImage })` : undefined,
		backgroundPosition: attributes.backgroundPosition,
		backgroundSize: attributes.backgroundSize,
		backgroundRepeat: attributes.backgroundRepeat,
		backgroundOrigin: attributes.backgroundOrigin,
		backgroundAttachment: attributes.backgroundAttachment ? 'fixed' : undefined,
		opacity: attributes.backgroundOpacity,
	} );
	
	return result;
	
}

const classes = ( attributes ) => {

	let result = [ classBlock ];
	
	if ( attributes.className )
		result.push( attributes.className );
	
	if ( attributes.align )
		result.push( `align${ attributes.align }` );
	
	if ( attributes.viewport )
		result.push( 'viewportfull' );
	
	if ( attributes.marginTopClass )
		result.push( `margin-top-${ attributes.marginTopClass }` );
	
	if ( attributes.marginBottomClass )
		result.push( `margin-bottom-${ attributes.marginBottomClass }` );
		
	if ( attributes.paddingTopClass )
		result.push( `padding-top-${ attributes.paddingTopClass }` );
		
	if ( attributes.paddingBottomClass )
		result.push( `padding-bottom-${ attributes.paddingBottomClass }` );
		
	return result.join(' ');
	
}

const Spacing = ( { label, value, onClick } ) => {
	
	const options = [
		{ name: 'S', size: 'small' },
		{ name: 'M', size: 'medium' },
		{ name: 'L', size: 'large' },
	];
		
	return (
		<BaseControl label={ label }>
			<ButtonGroup aria-label={ label }>
				{ options.map( ( { name, size } ) => (
					<Button
						key={ size }
						isLarge
						isPrimary={ value === size }
						aria-pressed={ value === size }
						onClick={ () => onClick( size == value ? undefined : size ) }
					>
						{ name }
					</Button>
				) ) }
			</ButtonGroup>
		</BaseControl>
	);
					
}

/**
 * Register: aa Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'cgb/block-editor-section', {
	
	title: 'Section',
	icon: 'editor-table',
	category: 'layout',
	keywords: [],
	
	supports: {
		
		html: false,
		anchor: true,
		align: [ 'full' ],
		
	},
	
	attributes: {
		
		align: { type: 'string', default: 'full' },
		viewport: { type: 'boolean' },
		
		marginTopClass: { type: 'string' },
		marginBottomClass: { type: 'string' },
		paddingTopClass: { type: 'string', default: 'medium' },
		paddingBottomClass: { type: 'string', default: 'medium' },
		
		backgroundAttachment: { type: 'boolean' },
		backgroundImage: { type: 'string' },
		backgroundPosition: { type: 'string', default: 'center center' },
		backgroundRepeat: { type: 'string', default: 'no-repeat' },
		backgroundSize: { type: 'string', default: 'cover' },
		backgroundColor: { type: 'string', default: '#EEEEEE' },
		backgroundOpacity: { type: 'number', default: 1 },
		
	},

	edit: function( props ) {
		
		if( 'full' != props.attributes.align )
			props.setAttributes( { align: 'full' } );

		const attributes = props.attributes;
		
		const inspector = (
			<InspectorControls>
				
				<PanelBody title='Spacing' initialOpen={ false }>
					<Spacing
						label='Margin Top'
						value={ attributes.marginTopClass }
						onClick={ ( value ) => { props.setAttributes( { marginTopClass: value } ) } }
					/>
				   <Spacing
						label='Margin Bottom'
						value={ attributes.marginBottomClass }
						onClick={ ( value ) => { props.setAttributes( { marginBottomClass: value } ) } }
					/>
					<Spacing
						label='Padding Top'
						value={ attributes.paddingTopClass }
						onClick={ ( value ) => { props.setAttributes( { paddingTopClass: value } ) } }
					/>
				   <Spacing
						label='Padding Bottom'
						value={ attributes.paddingBottomClass }
						onClick={ ( value ) => { props.setAttributes( { paddingBottomClass: value } ) } }
					/>
				</PanelBody>
				
				<PanelBody title='Background' initialOpen={ false }>
					<BaseControl>
						{ !! attributes.backgroundImage &&
							<MediaUpload
								onSelect={ ( media ) => props.setAttributes( { backgroundImage: media.url } ) }
								type="image"
								value={ attributes.backgroundImage }
								render={ ( { open } ) => (
									<Button onClick={ open } isLink>
										{ attributes.backgroundImage &&
											<img width="100%" src={ attributes.backgroundImage } alt='Featured image' />
										}
										{ ! attributes.backgroundImage && <Spinner /> }
									</Button>
								) }
							/>
						}
						{ ! attributes.backgroundImage &&
							<MediaUpload
								onSelect={ ( media ) => props.setAttributes( { backgroundImage: media.url } ) }
								type="image"
								value={ attributes.backgroundImage }
								render={ ( { open } ) => (
									<Button className="button" onClick={ open }>
										Select image
									</Button>
								) }
							/>
						}
						{ !! attributes.backgroundImage &&
							<Button onClick={ () => props.setAttributes( { backgroundImage: undefined } ) } isLink isDestructive>
								Remove Image
							</Button>
						}
					</BaseControl>
					<ToggleControl
						label='Fixed image'
						checked={ attributes.backgroundAttachment }
						onChange={ ( value ) => props.setAttributes( { backgroundAttachment: value } ) }
					/>
					<ToggleControl
						label='Full viewport'
						checked={ attributes.viewport }
						onChange={ ( value ) => props.setAttributes( { viewport: value } ) }
					/>
					<RangeControl
						label='Image opacity'
						value={ attributes.backgroundOpacity }
						onChange={ ( value ) => props.setAttributes( { backgroundOpacity: value } ) }
						min={ 0 }
						max={ 1 }
						step={ .1 }
				    />
					<SelectControl
						label='Position'
						value={ attributes.backgroundPosition }
						options={ [
							{ label: 'Default', value: '' },
							{ label: 'Left Top', value: 'left top' },
							{ label: 'Left Center', value: 'left center' },
							{ label: 'Left Bottom', value: 'left bottom' },
							{ label: 'Center Top', value: 'center top' },
							{ label: 'Center Center', value: 'center center' },
							{ label: 'Center Bottom', value: 'center bottom' },
							{ label: 'Right Top', value: 'right top' },
							{ label: 'Right Center', value: 'right center' },
							{ label: 'Right Bottom', value: 'right bottom' },
						] }
						onChange={ ( value ) => props.setAttributes( { backgroundPosition: value } ) }
					/>
					<SelectControl
						label='Repeat'
						value={ attributes.backgroundRepeat }
						options={ [
							{ label: 'Default', value: '' },
							{ label: 'No Repeat', value: 'no-repeat' },
							{ label: 'Repeat', value: 'repeat' },
							{ label: 'Repeat X', value: 'repeat-x' },
							{ label: 'Repeat Y', value: 'repeat-y' },
							{ label: 'Space', value: 'space' },
							{ label: 'Round', value: 'round' },
						] }
						onChange={ ( value ) => props.setAttributes( { backgroundRepeat: value } ) }
					/>
					<SelectControl
						label='Size'
						value={ attributes.backgroundSize }
						options={ [
							{ label: 'Default', value: '' },
							{ label: 'Cover', value: 'cover' },
							{ label: 'Contain', value: 'contain' },
						] }
						onChange={ ( value ) => props.setAttributes( { backgroundSize: value } ) }
					/>
					<BaseControl label='Color'>
						<ColorPalette
							value={ attributes.backgroundColor }
							onChange={ ( value ) => props.setAttributes( { backgroundColor: value } ) }
						/>
					</BaseControl>
				</PanelBody>
	
			</InspectorControls>	
		);
		
		const render = (
			<div
				className={ classes( attributes ) }
				style={ section( attributes ) }
			>
				{ attributes.backgroundImage && (
					<div className={ `${ classBlock }__image` } style={ image( attributes ) }></div>
				) }
				<div className={ `${ classBlock }__content entry-content` }>
					<InnerBlocks />
				</div>
			</div>
		);
		
		return [
			inspector,
			render
		];
		
	},

	save: function( props ) {
				
		const attributes = props.attributes;
		
		return (
			<div
				className={ classes( attributes ) }
				style={ section( attributes ) }
			>
				{ attributes.backgroundImage && (
					<div className={ `${ classBlock }__image` } style={ image( attributes ) }></div>
				) }
				<div className={ `${ classBlock }__content entry-content` }>
					<InnerBlocks.Content />
				</div>
			</div>
		);

	}
	
} );
