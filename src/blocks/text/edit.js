/**
 * BLOCK: amp Text
 *
 */

/**
 * Import Css
 */
import "./editor.scss";
import "./markformat";
import range from "lodash/range";
import map from "lodash/map";
import hexToRGBA from "../../hex-to-rgba";
import TypographyControls from "../../typography-control";
import InlineTypographyControls from "../../inline-typography-control";
import AdvancedColorControl from "../../advanced-color-control";
import WebfontLoader from "../../fontloader";
/**
 * Internal block libraries
 */
const { __, sprintf } = wp.i18n;
const { createBlock } = wp.blocks;
const {
	InspectorControls,
	BlockControls,
	AlignmentToolbar,
	InspectorAdvancedControls,
	RichText,
} = wp.blockEditor;
const { Component, Fragment } = wp.element;
const {
	PanelBody,
	Toolbar,
	RangeControl,
	ButtonGroup,
	Button,
	Dashicon,
	TabPanel,
	SelectControl,
	TextControl,
} = wp.components;
/**
 * Regular expression matching invalid anchor characters for replacement.
 *
 * @type {RegExp}
 */
const ANCHOR_REGEX = /[\s#]/g;

/**
 * This allows for checking to see if the block needs to generate a new ID.
 */
const advancedheadingUniqueIDs = [];

class ampAdvancedHeading extends Component {
	constructor() {
		super(...arguments);
		this.showSettings = this.showSettings.bind(this);
		this.state = {
			isVisible: false,
			user: amp_blocks_params.userrole ? amp_blocks_params.userrole : "admin",
			settings: {},
		};
	}
	componentDidMount() {
		if (!this.props.attributes.uniqueID) {
			const blockConfigObject = amp_blocks_params.configuration
				? JSON.parse(amp_blocks_params.configuration)
				: [];
			if (
				blockConfigObject["amp/advancedheading"] !== undefined &&
				typeof blockConfigObject["amp/advancedheading"] === "object"
			) {
				Object.keys(blockConfigObject["amp/advancedheading"]).map(
					(attribute) => {
						this.props.attributes[attribute] =
							blockConfigObject["amp/advancedheading"][attribute];
					}
				);
			}
			this.props.setAttributes({
				uniqueID: "_" + this.props.clientId.substr(2, 3),
			});
			advancedheadingUniqueIDs.push("_" + this.props.clientId.substr(2, 3));
		} else if (
			advancedheadingUniqueIDs.includes(this.props.attributes.uniqueID)
		) {
			this.props.setAttributes({
				uniqueID: "_" + this.props.clientId.substr(2, 3),
			});
			advancedheadingUniqueIDs.push("_" + this.props.clientId.substr(2, 3));
		} else {
			advancedheadingUniqueIDs.push(this.props.attributes.uniqueID);
		}
		const blockSettings = amp_blocks_params.settings
			? JSON.parse(amp_blocks_params.settings)
			: {};
		if (
			blockSettings["amp/advancedheading"] !== undefined &&
			typeof blockSettings["amp/advancedheading"] === "object"
		) {
			this.setState({ settings: blockSettings["amp/advancedheading"] });
		}
	}
	showSettings(key) {
		if (
			undefined === this.state.settings[key] ||
			"all" === this.state.settings[key]
		) {
			return true;
		} else if (
			"contributor" === this.state.settings[key] &&
			("contributor" === this.state.user ||
				"author" === this.state.user ||
				"editor" === this.state.user ||
				"admin" === this.state.user)
		) {
			return true;
		} else if (
			"author" === this.state.settings[key] &&
			("author" === this.state.user ||
				"editor" === this.state.user ||
				"admin" === this.state.user)
		) {
			return true;
		} else if (
			"editor" === this.state.settings[key] &&
			("editor" === this.state.user || "admin" === this.state.user)
		) {
			return true;
		} else if (
			"admin" === this.state.settings[key] &&
			"admin" === this.state.user
		) {
			return true;
		}
		return false;
	}
	render() {
		const {
			attributes,
			className,
			setAttributes,
			mergeBlocks,
			onReplace,
		} = this.props;
		const {
			uniqueID,
			align,
			level,
			content,
			color,
			size,
			sizeType,
			lineType,
			lineHeight,
			tabLineHeight,
			tabSize,
			mobileSize,
			mobileLineHeight,
			letterSpacing,
			typography,
			fontVariant,
			fontWeight,
			fontStyle,
			fontSubset,
			googleFont,
			marginType,
			topMargin,
			bottomMargin,
			markSize,
			markSizeType,
			markLineHeight,
			markLineType,
			markLetterSpacing,
			markTypography,
			markGoogleFont,
			markLoadGoogleFont,
			markFontSubset,
			markFontVariant,
			markFontWeight,
			markFontStyle,
			markPadding,
			markPaddingControl,
			markColor,
			markBG,
			markBGOpacity,
			markBorder,
			markBorderWidth,
			markBorderOpacity,
			markBorderStyle,
			anchor,
			textTransform,
			markTextTransform,
			ampAnimation,
			ampAOSOptions,
		} = attributes;
		const markBGString = markBG ? hexToRGBA(markBG, markBGOpacity) : "";
		const markBorderString = markBorder
			? hexToRGBA(markBorder, markBorderOpacity)
			: "";
		const gconfig = {
			google: {
				families: [typography + (fontVariant ? ":" + fontVariant : "")],
			},
		};
		let tagName = "p";
		if (level == "p") {
			tagName = "p";
		} else {
			tagName = "h" + level;
		}
		const sizeTypes = [
			{ key: "px", name: __("px") },
			{ key: "em", name: __("em") },
		];
		const fontMin = sizeType === "em" ? 0.2 : 5;
		const sgconfig = {
			google: {
				families: [
					markTypography + (markFontVariant ? ":" + markFontVariant : ""),
				],
			},
		};
		const config = googleFont ? gconfig : "";
		const sconfig = markGoogleFont ? sgconfig : "";
		const marginTypes = [
			{ key: "px", name: __("px") },
			{ key: "em", name: __("em") },
			{ key: "%", name: __("%") },
			{ key: "vh", name: __("vh") },
			{ key: "rem", name: __("rem") },
		];
		const marginMin = marginType === "em" || marginType === "rem" ? -2 : -100;
		const marginMax = marginType === "em" || marginType === "rem" ? 12 : 100;
		const marginStep = marginType === "em" || marginType === "rem" ? 0.1 : 1;
		const fontMax = sizeType === "em" ? 12 : 200;
		const fontStep = sizeType === "em" ? 0.1 : 1;
		const lineMin = lineType === "em" ? 0.2 : 5;
		const lineMax = lineType === "em" ? 12 : 200;
		const lineStep = lineType === "em" ? 0.1 : 1;
		const createLevelControl = (targetLevel) => {
			if (targetLevel == 1) {
				return [
					{
						icon: "editor-paragraph",
						// translators: %s: heading level e.g: "1", "2", "3"
						title: "Paragraph",
						isActive: level == "p" || typeof level === "undefined",
						onClick: () => setAttributes({ level: "p" }),
					},
					{
						icon: "heading",
						// translators: %s: heading level e.g: "1", "2", "3"
						title: sprintf(__("Heading %d"), targetLevel),
						isActive: targetLevel === level,
						onClick: () => setAttributes({ level: targetLevel }),
						subscript: String(targetLevel),
					},
				];
			} else {
				return [
					{
						icon: "heading",
						// translators: %s: heading level e.g: "1", "2", "3"
						title: sprintf(__("Heading %d"), targetLevel),
						isActive: targetLevel === level,
						onClick: () => setAttributes({ level: targetLevel }),
						subscript: String(targetLevel),
					},
				];
			}
		};
		const deskControls = (
			<PanelBody>
				<ButtonGroup
					className="amp-size-type-options"
					aria-label={__("Size Type")}
				>
					{map(sizeTypes, ({ name, key }) => (
						<Button
							key={key}
							className="amp-size-btn"
							isSmall
							isPrimary={sizeType === key}
							aria-pressed={sizeType === key}
							onClick={() => setAttributes({ sizeType: key })}
						>
							{name}
						</Button>
					))}
				</ButtonGroup>
				<RangeControl
					label={__("Font Size")}
					value={size ? size : ""}
					onChange={(value) => setAttributes({ size: value })}
					min={fontMin}
					max={fontMax}
					step={fontStep}
				/>
				<ButtonGroup
					className="amp-size-type-options"
					aria-label={__("Size Type")}
				>
					{map(sizeTypes, ({ name, key }) => (
						<Button
							key={key}
							className="amp-size-btn"
							isSmall
							isPrimary={lineType === key}
							aria-pressed={lineType === key}
							onClick={() => setAttributes({ lineType: key })}
						>
							{name}
						</Button>
					))}
				</ButtonGroup>
				<RangeControl
					label={__("Line Height")}
					value={lineHeight ? lineHeight : ""}
					onChange={(value) => setAttributes({ lineHeight: value })}
					min={lineMin}
					max={lineMax}
					step={lineStep}
				/>
			</PanelBody>
		);
		const tabletControls = (
			<PanelBody>
				<ButtonGroup
					className="amp-size-type-options"
					aria-label={__("Size Type")}
				>
					{map(sizeTypes, ({ name, key }) => (
						<Button
							key={key}
							className="amp-size-btn"
							isSmall
							isPrimary={sizeType === key}
							aria-pressed={sizeType === key}
							onClick={() => setAttributes({ sizeType: key })}
						>
							{name}
						</Button>
					))}
				</ButtonGroup>
				<RangeControl
					label={__("Tablet Font Size")}
					value={tabSize ? tabSize : ""}
					onChange={(value) => setAttributes({ tabSize: value })}
					min={fontMin}
					max={fontMax}
					step={fontStep}
				/>
				<ButtonGroup
					className="amp-size-type-options"
					aria-label={__("Size Type")}
				>
					{map(sizeTypes, ({ name, key }) => (
						<Button
							key={key}
							className="amp-size-btn"
							isSmall
							isPrimary={lineType === key}
							aria-pressed={lineType === key}
							onClick={() => setAttributes({ lineType: key })}
						>
							{name}
						</Button>
					))}
				</ButtonGroup>
				<RangeControl
					label={__("Tablet Line Height")}
					value={tabLineHeight ? tabLineHeight : ""}
					onChange={(value) => setAttributes({ tabLineHeight: value })}
					min={lineMin}
					max={lineMax}
					step={lineStep}
				/>
			</PanelBody>
		);
		const mobileControls = (
			<PanelBody>
				<ButtonGroup
					className="amp-size-type-options"
					aria-label={__("Size Type")}
				>
					{map(sizeTypes, ({ name, key }) => (
						<Button
							key={key}
							className="amp-size-btn"
							isSmall
							isPrimary={sizeType === key}
							aria-pressed={sizeType === key}
							onClick={() => setAttributes({ sizeType: key })}
						>
							{name}
						</Button>
					))}
				</ButtonGroup>
				<RangeControl
					label={__("Mobile Font Size")}
					value={mobileSize ? mobileSize : ""}
					onChange={(value) => setAttributes({ mobileSize: value })}
					min={fontMin}
					max={fontMax}
					step={fontStep}
				/>
				<ButtonGroup
					className="amp-size-type-options"
					aria-label={__("Size Type")}
				>
					{map(sizeTypes, ({ name, key }) => (
						<Button
							key={key}
							className="amp-size-btn"
							isSmall
							isPrimary={lineType === key}
							aria-pressed={lineType === key}
							onClick={() => setAttributes({ lineType: key })}
						>
							{name}
						</Button>
					))}
				</ButtonGroup>
				<RangeControl
					label={__("Mobile Line Height")}
					value={mobileLineHeight ? mobileLineHeight : ""}
					onChange={(value) => setAttributes({ mobileLineHeight: value })}
					min={lineMin}
					max={lineMax}
					step={lineStep}
				/>
			</PanelBody>
		);
		const tabControls = (
			<TabPanel
				className="amp-size-tabs"
				activeClass="active-tab"
				tabs={[
					{
						name: "desk",
						title: <Dashicon icon="desktop" />,
						className: "amp-desk-tab",
					},
					{
						name: "tablet",
						title: <Dashicon icon="tablet" />,
						className: "amp-tablet-tab",
					},
					{
						name: "mobile",
						title: <Dashicon icon="smartphone" />,
						className: "amp-mobile-tab",
					},
				]}
			>
				{(tab) => {
					let tabout;
					if (tab.name) {
						if ("mobile" === tab.name) {
							tabout = mobileControls;
						} else if ("tablet" === tab.name) {
							tabout = tabletControls;
						} else {
							tabout = deskControls;
						}
					}
					return <div>{tabout}</div>;
				}}
			</TabPanel>
		);
		const headingContent = (
			<RichText
				formattingControls={["bold", "italic", "link", "mark"]}
				allowedFormats={["core/bold", "core/italic", "core/link", "amp/mark"]}
				wrapperClassName={className}
				tagName={tagName}
				value={content}
				onChange={(value) => setAttributes({ content: value })}
				onMerge={mergeBlocks}
				onSplit={(value) => {
					if (!value) {
						return createBlock("core/paragraph");
					}
					return createBlock("amp/advancedheading", {
						...attributes,
						content: value,
					});
				}}
				onReplace={onReplace}
				onRemove={() => onReplace([])}
				style={{
					textAlign: align,
					color: color,
					fontWeight: fontWeight,
					fontStyle: fontStyle,
					letterSpacing: letterSpacing + "px",
					textTransform: textTransform ? textTransform : undefined,
					fontFamily: typography ? typography : "",
					marginTop: undefined !== topMargin ? topMargin + marginType : "",
					marginBottom:
						undefined !== bottomMargin ? bottomMargin + marginType : "",
				}}
				className={`h${uniqueID}`}
				placeholder={__("Add your text.....")}
			/>
		);
		let css = "";
		if (typeof size !== "undefined" || typeof lineHeight !== "undefined") {
			css += ".block-editor-block-list__layout .wp-block .h" + uniqueID + " {";
			if (typeof size !== "undefined") {
				css += "font-size:" + size + sizeType + ";";
			}
			if (typeof lineHeight !== "undefined") {
				css += "line-height:" + lineHeight + lineType + ";";
			}
			css += " } ";
		}
		if (
			typeof tabSize !== "undefined" ||
			typeof tabLineHeight !== "undefined"
		) {
			css += "@media (min-width: 767px) and (max-width: 1024px) {";
			css += ".block-editor-block-list__layout .wp-block .h" + uniqueID + " {";
			if (typeof tabSize != "undefined") {
				css += "font-size:" + tabSize + sizeType + ";";
			}
			if (typeof tabLineHeight != "undefined") {
				css += "line-height:" + tabLineHeight + lineType + ";";
			}
			css += "}";
			css += "}";
		}
		if (
			typeof mobileSize !== "undefined" ||
			typeof mobileLineHeight !== "undefined"
		) {
			css += "@media (max-width: 767px) {";
			css += ".block-editor-block-list__layout .wp-block .h" + uniqueID + " {";
			if (typeof mobileSize != "undefined") {
				css += "font-size:" + mobileSize + sizeType + ";";
			}
			if (typeof mobileLineHeight != "undefined") {
				css += "line-height:" + mobileLineHeight + lineType + ";";
			}
			css += "}";
			css += "}";
		}
		return (
			<Fragment>
				<style>
					{css}
					{`.h${uniqueID} mark {
						color: ${markColor};
						background: ${markBG ? markBGString : "transparent"};
						font-weight: ${markTypography && markFontWeight ? markFontWeight : "inherit"};
						font-style: ${markTypography && markFontStyle ? markFontStyle : "inherit"};
						font-size: ${markSize && markSize[0] ? markSize[0] + markSizeType : "inherit"};
						line-height: ${
							markLineHeight && markLineHeight[0]
								? markLineHeight[0] + markLineType
								: "inherit"
						};
						letter-spacing: ${markLetterSpacing ? markLetterSpacing + "px" : "inherit"};
						text-transform: ${markTextTransform ? markTextTransform : "inherit"};
						font-family: ${markTypography ? markTypography : "inherit"};
						border-color: ${markBorder ? markBorderString : "transparent"};
						border-width: ${markBorderWidth ? markBorderWidth + "px" : "0"};
						border-style: ${markBorderStyle ? markBorderStyle : "solid"};
						padding: ${
							markPadding
								? markPadding[0] +
								  "px " +
								  markPadding[1] +
								  "px " +
								  markPadding[2] +
								  "px " +
								  markPadding[3] +
								  "px"
								: ""
						};
					}`}
				</style>
				<BlockControls>
					{this.showSettings("allSettings") &&
						this.showSettings("toolbarTypography") && (
							<InlineTypographyControls
								uniqueID={uniqueID}
								letterSpacing={letterSpacing}
								onLetterSpacing={(value) =>
									setAttributes({ letterSpacing: value })
								}
								fontFamily={typography}
								onFontFamily={(value) => setAttributes({ typography: value })}
								onFontChange={(select) => {
									setAttributes({
										typography: select.value,
										googleFont: select.google,
									});
								}}
								googleFont={googleFont}
								onGoogleFont={(value) => setAttributes({ googleFont: value })}
								fontVariant={fontVariant}
								onFontVariant={(value) => setAttributes({ fontVariant: value })}
								fontWeight={fontWeight}
								onFontWeight={(value) => setAttributes({ fontWeight: value })}
								fontStyle={fontStyle}
								onFontStyle={(value) => setAttributes({ fontStyle: value })}
								fontSubset={fontSubset}
								onFontSubset={(value) => setAttributes({ fontSubset: value })}
								textTransform={textTransform}
								onTextTransform={(value) =>
									setAttributes({ textTransform: value })
								}
								fontSizeArray={false}
								fontSize={size}
								onFontSize={(value) => setAttributes({ size: value })}
								fontSizeType={sizeType}
								onFontSizeType={(value) => setAttributes({ sizeType: value })}
								lineHeight={lineHeight}
								onLineHeight={(value) => setAttributes({ lineHeight: value })}
								lineHeightType={lineType}
								onLineHeightType={(value) => setAttributes({ lineType: value })}
								tabSize={tabSize}
								onTabSize={(value) => setAttributes({ tabSize: value })}
								tabLineHeight={tabLineHeight}
								onTabLineHeight={(value) =>
									setAttributes({ tabLineHeight: value })
								}
								mobileSize={mobileSize}
								onMobileSize={(value) => setAttributes({ mobileSize: value })}
								mobileLineHeight={mobileLineHeight}
								onMobileLineHeight={(value) =>
									setAttributes({ mobileLineHeight: value })
								}
							/>
						)}
					<AlignmentToolbar
						value={align}
						onChange={(nextAlign) => {
							setAttributes({ align: nextAlign });
						}}
					/>
				</BlockControls>
				{this.showSettings("allSettings") && (
					<InspectorControls>
						<PanelBody title={__("Heading Tags")}>
							<div className="amp-tag-level-control">
								<p>{__("HTML Tag")}</p>
								<Toolbar controls={range(1, 7).map(createLevelControl)} />
							</div>
						</PanelBody>

						<PanelBody title={__("Typography Settings")}>
							<TypographyControls
								letterSpacing={letterSpacing}
								onLetterSpacing={(value) =>
									setAttributes({ letterSpacing: value })
								}
								fontFamily={typography}
								onFontFamily={(value) => setAttributes({ typography: value })}
								onFontChange={(select) => {
									setAttributes({
										typography: select.value,
										googleFont: select.google,
									});
								}}
								googleFont={googleFont}
								onGoogleFont={(value) => setAttributes({ googleFont: value })}
								fontVariant={fontVariant}
								onFontVariant={(value) => setAttributes({ fontVariant: value })}
								fontWeight={fontWeight}
								onFontWeight={(value) => setAttributes({ fontWeight: value })}
								fontStyle={fontStyle}
								onFontStyle={(value) => setAttributes({ fontStyle: value })}
								fontSubset={fontSubset}
								onFontSubset={(value) => setAttributes({ fontSubset: value })}
								textTransform={textTransform}
								onTextTransform={(value) =>
									setAttributes({ textTransform: value })
								}
							/>
							{this.showSettings("sizeSettings") && (
								<Fragment>
									<h2 className="amp-heading-size-title">
										{__("Size Controls")}
									</h2>
									{tabControls}
								</Fragment>
							)}
						</PanelBody>

						<PanelBody title={__("Color")} initialOpen={false}>
							{this.showSettings("colorSettings") && (
								<AdvancedColorControl
									label={__("Text Color")}
									colorValue={color ? color : ""}
									colorDefault={""}
									onColorChange={(value) => setAttributes({ color: value })}
								/>
							)}
						</PanelBody>
						<PanelBody title={__("Alignment")} initialOpen={false}>
							<p>{__("Text Alignment")}</p>
							<AlignmentToolbar
								value={align}
								onChange={(nextAlign) => {
									setAttributes({ align: nextAlign });
								}}
							/>
						</PanelBody>
						{this.showSettings("marginSettings") && (
							<PanelBody title={__("Gapping")} initialOpen={false}>
								<ButtonGroup
									className="amp-size-type-options"
									aria-label={__("Margin Type")}
								>
									{map(marginTypes, ({ name, key }) => (
										<Button
											key={key}
											className="amp-size-btn"
											isSmall
											isPrimary={marginType === key}
											aria-pressed={marginType === key}
											onClick={() => setAttributes({ marginType: key })}
										>
											{name}
										</Button>
									))}
								</ButtonGroup>
								<RangeControl
									label={__("Top Margin")}
									value={undefined !== topMargin ? topMargin : ""}
									onChange={(value) => setAttributes({ topMargin: value })}
									min={marginMin}
									max={marginMax}
									step={marginStep}
								/>
								<ButtonGroup
									className="amp-size-type-options"
									aria-label={__("Margin Type")}
								>
									{map(marginTypes, ({ name, key }) => (
										<Button
											key={key}
											className="amp-size-btn"
											isSmall
											isPrimary={marginType === key}
											aria-pressed={marginType === key}
											onClick={() => setAttributes({ marginType: key })}
										>
											{name}
										</Button>
									))}
								</ButtonGroup>
								<RangeControl
									label={__("Bottom Margin")}
									value={undefined !== bottomMargin ? bottomMargin : ""}
									onChange={(value) => setAttributes({ bottomMargin: value })}
									min={marginMin}
									max={marginMax}
									step={marginStep}
								/>
							</PanelBody>
						)}
					</InspectorControls>
				)}
				<InspectorAdvancedControls>
					<TextControl
						label={__("HTML Anchor")}
						help={__("Anchors lets you link directly to a section on a page.")}
						value={anchor || ""}
						onChange={(nextValue) => {
							nextValue = nextValue.replace(ANCHOR_REGEX, "-");
							setAttributes({
								anchor: nextValue,
							});
						}}
					/>
				</InspectorAdvancedControls>
				{ampAnimation && (
					<div className={`amp-animation-wrap-${ampAnimation}`}>
						<div
							id={`animate-id${uniqueID}`}
							className={"aos-animate amp-animation-wrap"}
							data-aos={ampAnimation ? ampAnimation : undefined}
							data-aos-duration={
								ampAOSOptions && ampAOSOptions[0] && ampAOSOptions[0].duration
									? ampAOSOptions[0].duration
									: undefined
							}
							data-aos-easing={
								ampAOSOptions && ampAOSOptions[0] && ampAOSOptions[0].easing
									? ampAOSOptions[0].easing
									: undefined
							}
						>
							{headingContent}
						</div>
					</div>
				)}
				{!ampAnimation && headingContent}
				{googleFont && <WebfontLoader config={config}></WebfontLoader>}
				{markGoogleFont && <WebfontLoader config={sconfig}></WebfontLoader>}
			</Fragment>
		);
	}
}
export default ampAdvancedHeading;
