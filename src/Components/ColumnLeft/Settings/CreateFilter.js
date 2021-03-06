/*
 *  Copyright (c) 2018-present, Evgeny Nadymov
 *
 * This source code is licensed under the GPL v.3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import AddIcon from '../../../Assets/Icons/Add';
import ContactsIcon from '../../../Assets/Icons/NewPrivate';
import NonContactsIcon from '../../../Assets/Icons/NonContacts';
import GroupsIcon from '../../../Assets/Icons/NewGroup';
import ChannelsIcon from '../../../Assets/Icons/NewChannel';
import MutedIcon from '../../../Assets/Icons/Mute';
import ReadIcon from '../../../Assets/Icons/ReadChats';
import ArchivedIcon from '../../../Assets/Icons/Archive';
import BotsIcon from '../../../Assets/Icons/Bots';
import RemoveIcon from '@material-ui/icons/Remove';
import ArrowBackIcon from '../../../Assets/Icons/Back';
import DoneIcon from '../../../Assets/Icons/Done';
import FilterChat from '../../Tile/FilterChat';
import FilterText from '../../Tile/FilterText';
import SectionHeader from '../SectionHeader';
import './CreateFilter.css';

const Lottie = React.lazy(() => import('../../Viewer/Lottie'));

class CreateFilter extends React.Component {

    constructor(props) {
        super(props);

        this.titleRef = React.createRef();
        this.lottieRef = React.createRef();

        this.state = {
            prevFilterId: -1,
            data: null
        }
    }

    static getDerivedStateFromProps(props, state) {
        const { filter, filterId } = props;
        const { prevFilterId } = state;

        if (filter && prevFilterId !== filterId){
            return {
                prevFilterId: filterId,
                editFilter: {...filter}
            }
        }

        return null;
    }

    componentDidMount() {
        this.loadAnimationData();
    }

    loadAnimationData = async () => {
        const { closeData } = this.state;
        if (closeData) return;

        try {
            const requests = [
                fetch('data/Folders_2.json')
            ];

            const results = await Promise.all(requests);

            const [data] = await Promise.all(results.map(x => x.json()));

            this.setState(
                {
                    data
                }
            );
        } catch (error) {
            console.error(error);
        }
    };

    handleDone = () => {
        const { onDone } = this.props;
        const { editFilter } = this.state;

        editFilter.title = this.titleRef.current.value;

        onDone && onDone(editFilter);
    };

    handleAnimationClick = () => {
        const lottie = this.lottieRef.current;
        if (!lottie) return;
        if (!lottie.anim) return;
        if (!lottie.anim.isPaused) return;

        lottie.anim.goToAndPlay(0);
    };

    handleDeleteIncludeContacts = () => {
        const { editFilter } = this.state;
        if (!editFilter) return;

        const newEditFilter = { ...editFilter, include_contacts: false };

        this.setState({
            editFilter: newEditFilter
        })
    };

    handleDeleteIncludeNonContacts = () => {
        const { editFilter } = this.state;
        if (!editFilter) return;

        const newEditFilter = { ...editFilter, include_non_contacts: false };

        this.setState({
            editFilter: newEditFilter
        })
    };

    handleDeleteIncludeGroups = () => {
        const { editFilter } = this.state;
        if (!editFilter) return;

        const newEditFilter = { ...editFilter, include_groups: false };

        this.setState({
            editFilter: newEditFilter
        })
    };

    handleDeleteIncludeChannels = () => {
        const { editFilter } = this.state;
        if (!editFilter) return;

        const newEditFilter = { ...editFilter, include_channels: false };

        this.setState({
            editFilter: newEditFilter
        })
    };

    handleDeleteIncludeBots = () => {
        const { editFilter } = this.state;
        if (!editFilter) return;

        const newEditFilter = { ...editFilter, include_bots: false };

        this.setState({
            editFilter: newEditFilter
        })
    };

    handleDeleteIncludedChat = chatId => {
        const { editFilter } = this.state;
        if (!editFilter) return;

        const newEditFilter = { ...editFilter, included_chat_ids: editFilter.included_chat_ids.filter(x => x !== chatId) };

        this.setState({
            editFilter: newEditFilter
        })
    };

    handleDeleteExcludeMuted = () => {
        const { editFilter } = this.state;
        if (!editFilter) return;

        const newEditFilter = { ...editFilter, exclude_muted: false };

        this.setState({
            editFilter: newEditFilter
        })
    };

    handleDeleteExcludeRead = () => {
        const { editFilter } = this.state;
        if (!editFilter) return;

        const newEditFilter = { ...editFilter, exclude_read: false };

        this.setState({
            editFilter: newEditFilter
        })
    };

    handleDeleteExcludeArchived = () => {
        const { editFilter } = this.state;
        if (!editFilter) return;

        const newEditFilter = { ...editFilter, exclude_archived: false };

        this.setState({
            editFilter: newEditFilter
        })
    };

    handleDeleteExcludedChat = chatId => {
        const { editFilter } = this.state;
        if (!editFilter) return;

        const newEditFilter = { ...editFilter, excluded_chat_ids: editFilter.excluded_chat_ids.filter(x => x !== chatId) };

        this.setState({
            editFilter: newEditFilter
        })
    };

    render() {
        const { t, filter, id, onClose } = this.props;
        if (!filter) return null;

        const { editFilter, data } = this.state;

        const {
            include_contacts,
            include_non_contacts,
            include_bots,
            include_groups,
            include_channels,
            included_chat_ids
        } = editFilter;

        const {
            exclude_muted,
            exclude_read,
            exclude_archived,
            excluded_chat_ids
        } = editFilter;

        const defaultTitle = filter.title;

        return (
            <>
                <div className='header-master'>
                    <IconButton className='header-left-button' onClick={onClose}>
                        <ArrowBackIcon />
                    </IconButton>
                    <div className='header-status grow cursor-pointer'>
                        <span className='header-status-content'>{id >= 0 ? t('FilterEdit') : t('CreateNewFilter')}</span>
                    </div>
                    <IconButton className='header-right-button' color='primary' onClick={this.handleDone}>
                        <DoneIcon />
                    </IconButton>
                </div>
                <div className='sidebar-page-content'>
                    <div className='filters-create-animation'>
                        <React.Suspense fallback={null}>
                            <Lottie
                                ref={this.lottieRef}
                                options={{
                                    autoplay: true,
                                    loop: false,
                                    animationData: data,
                                    renderer: 'svg',
                                    rendererSettings: {
                                        preserveAspectRatio: 'xMinYMin slice', // Supports the same options as the svg element's preserveAspectRatio property
                                        clearCanvas: false,
                                        progressiveLoad: true, // Boolean, only svg renderer, loads dom elements when needed. Might speed up initialization for large number of elements.
                                        hideOnTransparent: true, //Boolean, only svg renderer, hides elements when opacity reaches 0 (defaults to true)
                                    }
                                }}
                                onClick={this.handleAnimationClick}
                            />
                        </React.Suspense>
                    </div>


                    <div className='create-filter-title'>
                        <TextField
                            inputRef={this.titleRef}
                            className='edit-profile-input'
                            variant='outlined'
                            fullWidth
                            label={t('FilterNameHint')}
                            defaultValue={defaultTitle}
                        />
                    </div>
                    <div className='sidebar-page-section'>
                        <SectionHeader>{t('FilterInclude')}</SectionHeader>
                        <FilterText className='create-filter-add-chats' icon={<AddIcon/>} text={t('FilterAddChats')} />
                        {include_contacts && <FilterText onDelete={this.handleDeleteIncludeContacts} icon={<ContactsIcon className='filter-text-subtle-icon' viewBox='0 0 36 36'/>} text={t('FilterContacts')} />}
                        {include_non_contacts && <FilterText onDelete={this.handleDeleteIncludeNonContacts} icon={<NonContactsIcon className='filter-text-subtle-icon'/>} text={t('FilterNonContacts')} />}
                        {include_groups && <FilterText onDelete={this.handleDeleteIncludeGroups} icon={<GroupsIcon className='filter-text-subtle-icon' viewBox='0 0 36 36'/>} text={t('FilterGroups')} />}
                        {include_channels && <FilterText onDelete={this.handleDeleteIncludeChannels} icon={<ChannelsIcon className='filter-text-subtle-icon' viewBox='0 0 36 36'/>} text={t('FilterChannels')} />}
                        {include_bots && <FilterText onDelete={this.handleDeleteIncludeBots} icon={<BotsIcon className='filter-text-subtle-icon'/>} text={t('FilterBots')} />}
                        { included_chat_ids.map(x => (
                            <FilterChat key={x} chatId={x} onDelete={this.handleDeleteIncludedChat}/>
                        ))}
                    </div>
                    <div className='sidebar-page-section'>
                        <SectionHeader>{t('FilterExclude')}</SectionHeader>
                        <FilterText className='create-filter-remove-chats' icon={<RemoveIcon/>} text={t('FilterRemoveChats')}/>
                        {exclude_muted && <FilterText onDelete={this.handleDeleteExcludeMuted} icon={<MutedIcon className='filter-text-subtle-icon'/>} text={t('FilterMuted')} />}
                        {exclude_read && <FilterText onDelete={this.handleDeleteExcludeRead} icon={<ReadIcon className='filter-text-subtle-icon'/>} text={t('FilterRead')} />}
                        {exclude_archived && <FilterText onDelete={this.handleDeleteExcludeArchived} icon={<ArchivedIcon className='filter-text-subtle-icon'/>} text={t('FilterArchived')} />}
                        { excluded_chat_ids.map(x => (
                            <FilterChat key={x} chatId={x} onDelete={this.handleDeleteExcludedChat}/>
                        ))}
                    </div>
                </div>
            </>
        );
    }

}

CreateFilter.propTypes = {
    filter: PropTypes.object,
    id: PropTypes.number,
    onDone: PropTypes.func,
    onClose: PropTypes.func
};

export default withTranslation()(CreateFilter);